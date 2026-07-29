import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import type { CreateSubjectInput, UpdateSubjectInput } from './types';

export const createSubject = async (input: CreateSubjectInput) => {
  const topic = await prisma.topic.findUnique({ where: { id: input.topicId } });
  if (!topic) {
    throw new NotFoundError('Topic not found');
  }

  const existingSubject = await prisma.subject.findFirst({
    where: { name: input.name, topicId: input.topicId },
  });
  if (existingSubject) {
    throw new ValidationError('Subject with this name already exists in this topic');
  }

  const subject = await prisma.subject.create({ data: input });
  return subject;
};

export const getSubjects = async () => {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: 'asc' },
    include: {
      topic: {
        select: { id: true, name: true },
      },
      _count: {
        select: { courses: true },
      },
    },
  });
  return subjects;
};

export const getSubjectById = async (id: string) => {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      topic: true,
    },
  });

  if (!subject) {
    throw new NotFoundError('Subject not found');
  }

  return subject;
};

export const getSubjectsByTopic = async (topicId: string) => {
  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!topic) {
    throw new NotFoundError('Topic not found');
  }

  const subjects = await prisma.subject.findMany({
    where: { topicId, isActive: true },
    orderBy: { name: 'asc' },
  });

  return subjects;
};

export const updateSubject = async (id: string, input: UpdateSubjectInput) => {
  const subject = await prisma.subject.findUnique({ where: { id } });
  if (!subject) {
    throw new NotFoundError('Subject not found');
  }

  if (input.name && input.name !== subject.name) {
    const existingSubject = await prisma.subject.findFirst({
      where: { name: input.name, topicId: input.topicId || subject.topicId },
    });
    if (existingSubject) {
      throw new ValidationError('Subject with this name already exists');
    }
  }

  if (input.topicId) {
    const topic = await prisma.topic.findUnique({ where: { id: input.topicId } });
    if (!topic) {
      throw new NotFoundError('Topic not found');
    }
  }

  const updatedSubject = await prisma.subject.update({
    where: { id },
    data: input,
    include: { topic: true },
  });

  return updatedSubject;
};

export const deleteSubject = async (id: string) => {
  const subject = await prisma.subject.findUnique({ where: { id } });
  if (!subject) {
    throw new NotFoundError('Subject not found');
  }

  await prisma.subject.delete({ where: { id } });
  return { message: 'Subject deleted successfully' };
};

export const toggleSubjectStatus = async (id: string) => {
  const subject = await prisma.subject.findUnique({ where: { id } });
  if (!subject) {
    throw new NotFoundError('Subject not found');
  }

  const updatedSubject = await prisma.subject.update({
    where: { id },
    data: { isActive: !subject.isActive },
  });

  return {
    subject: updatedSubject,
    message: `Subject ${updatedSubject.isActive ? 'activated' : 'deactivated'} successfully`,
  };
};
