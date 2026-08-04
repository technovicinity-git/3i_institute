import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import type { SendMessageInput } from './types';

export const sendMessage = async (userId: string, input: SendMessageInput) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: input.courseId } },
  });

  const course = await prisma.course.findUnique({ where: { id: input.courseId } });
  if (!course) throw new NotFoundError('Course not found');

  const isTeacher = course.teacherId === userId;
  if (!enrollment && !isTeacher) {
    throw new ValidationError('Must be enrolled or be the teacher to send messages');
  }

  const message = await prisma.chatMessage.create({
    data: {
      courseId: input.courseId,
      senderId: userId,
      message: input.message,
    },
    include: {
      sender: {
        select: {
          id: true,
          role: true,
          profile: {
            select: { firstName: true, lastName: true, avatar: true },
          },
        },
      },
    },
  });

  return message;
};

export const getCourseMessages = async (courseId: string, userId: string, page = 1, limit = 50) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new NotFoundError('Course not found');

  if (!enrollment && course.teacherId !== userId) {
    throw new ValidationError('Not authorized to view messages');
  }

  const [messages, total] = await Promise.all([
    prisma.chatMessage.findMany({
      where: { courseId },
      include: {
        sender: {
          select: {
            id: true,
            role: true,
            profile: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.chatMessage.count({ where: { courseId } }),
  ]);

  return {
    messages: messages.reverse(),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const deleteMessage = async (messageId: string, userId: string) => {
  const message = await prisma.chatMessage.findUnique({ where: { id: messageId } });
  if (!message) throw new NotFoundError('Message not found');
  if (message.senderId !== userId) throw new ValidationError('Can only delete your own messages');

  await prisma.chatMessage.delete({ where: { id: messageId } });
  return { message: 'Message deleted' };
};
