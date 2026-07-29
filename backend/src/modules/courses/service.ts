import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import { Prisma } from '@prisma/client';
import type { CreateCourseInput, UpdateCourseInput, CourseFilters } from './types';

export const createCourse = async (teacherId: string, input: CreateCourseInput) => {
  if (input.topicId) {
    const topic = await prisma.topic.findUnique({ where: { id: input.topicId } });
    if (!topic) throw new NotFoundError('Topic not found');
  }

  if (input.subjectId) {
    const subject = await prisma.subject.findUnique({ where: { id: input.subjectId } });
    if (!subject) throw new NotFoundError('Subject not found');
  }

  const course = await prisma.course.create({
    data: {
      ...input,
      teacherId,
    },
    include: {
      topic: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true } },
      teacher: {
        select: {
          id: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

  return course;
};

export const getCourses = async (filters: CourseFilters) => {
  const { search, type, status, topicId, subjectId, teacherId, page = 1, limit = 10 } = filters;

  const where: Prisma.CourseWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (type) where.type = type;
  if (status) where.status = status;
  if (topicId) where.topicId = topicId;
  if (subjectId) where.subjectId = subjectId;
  if (teacherId) where.teacherId = teacherId;

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        topic: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        teacher: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getTeacherCourses = async (teacherId: string, filters: CourseFilters) => {
  return getCourses({ ...filters, teacherId });
};

export const getPublishedCourses = async (filters: CourseFilters) => {
  return getCourses({ ...filters, status: 'PUBLISHED' });
};

export const getCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      topic: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true } },
      teacher: {
        select: {
          id: true,
          email: true,
          profile: { select: { firstName: true, lastName: true, avatar: true, bio: true } },
        },
      },
      _count: {
        select: { enrollments: true, examPapers: true },
      },
    },
  });

  if (!course) throw new NotFoundError('Course not found');
  return course;
};

export const updateCourse = async (id: string, teacherId: string, input: UpdateCourseInput) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new NotFoundError('Course not found');

  if (course.teacherId !== teacherId) {
    throw new ValidationError('You can only update your own courses');
  }

  if (input.topicId) {
    const topic = await prisma.topic.findUnique({ where: { id: input.topicId } });
    if (!topic) throw new NotFoundError('Topic not found');
  }

  if (input.subjectId) {
    const subject = await prisma.subject.findUnique({ where: { id: input.subjectId } });
    if (!subject) throw new NotFoundError('Subject not found');
  }

  const updatedCourse = await prisma.course.update({
    where: { id },
    data: input,
    include: {
      topic: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true } },
    },
  });

  return updatedCourse;
};

export const updateCourseStatus = async (
  id: string,
  teacherId: string,
  status: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED',
) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new NotFoundError('Course not found');

  if (course.teacherId !== teacherId) {
    throw new ValidationError('You can only update your own courses');
  }

  const updatedCourse = await prisma.course.update({
    where: { id },
    data: { status },
  });

  return {
    course: updatedCourse,
    message: `Course ${status.toLowerCase()} successfully`,
  };
};

export const deleteCourse = async (id: string, teacherId: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new NotFoundError('Course not found');

  if (course.teacherId !== teacherId) {
    throw new ValidationError('You can only delete your own courses');
  }

  await prisma.course.delete({ where: { id } });
  return { message: 'Course deleted successfully' };
};
