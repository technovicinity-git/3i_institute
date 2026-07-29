import prisma from '@/config/database';
import { NotFoundError } from '@/common/errors';
import { Prisma } from '@prisma/client';
import type { StudentFilters, UpdateStudentProfileInput } from './types';

export const getStudents = async (filters: StudentFilters) => {
  const {
    search,
    status,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const where: Prisma.UserWhereInput = {
    role: 'STUDENT',
  };

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { firstName: { contains: search, mode: 'insensitive' } } },
      { profile: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (status) where.status = status;

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            bio: true,
            gender: true,
            city: true,
            country: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    students,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getStudentById = async (id: string) => {
  const student = await prisma.user.findFirst({
    where: { id, role: 'STUDENT' },
    select: {
      id: true,
      email: true,
      status: true,
      emailVerified: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          bio: true,
          dateOfBirth: true,
          gender: true,
          address: true,
          city: true,
          country: true,
        },
      },
    },
  });

  if (!student) {
    throw new NotFoundError('Student not found');
  }

  // Get enrollment count using the enrollment model
  const enrollmentCount = await prisma.enrollment.count({
    where: { userId: id },
  });

  return { ...student, totalEnrollments: enrollmentCount };
};

export const getStudentEnrollments = async (id: string) => {
  const student = await prisma.user.findFirst({
    where: { id, role: 'STUDENT' },
  });

  if (!student) {
    throw new NotFoundError('Student not found');
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          status: true,
          teacher: {
            select: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  return enrollments;
};

export const getStudentExamHistory = async (id: string) => {
  const student = await prisma.user.findFirst({
    where: { id, role: 'STUDENT' },
  });

  if (!student) {
    throw new NotFoundError('Student not found');
  }

  const exams = await prisma.studentExam.findMany({
    where: { userId: id },
    include: {
      examPaper: {
        select: {
          id: true,
          title: true,
          totalMarks: true,
          passingMarks: true,
          courseId: true,
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });

  return exams;
};

export const suspendStudent = async (id: string) => {
  const student = await prisma.user.findFirst({
    where: { id, role: 'STUDENT', status: 'ACTIVE' },
  });

  if (!student) {
    throw new NotFoundError('Active student not found');
  }

  const updatedStudent = await prisma.user.update({
    where: { id },
    data: { status: 'SUSPENDED' },
    select: {
      id: true,
      email: true,
      status: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return {
    student: updatedStudent,
    message: 'Student suspended successfully',
  };
};

export const activateStudent = async (id: string) => {
  const student = await prisma.user.findFirst({
    where: { id, role: 'STUDENT', status: 'SUSPENDED' },
  });

  if (!student) {
    throw new NotFoundError('Suspended student not found');
  }

  const updatedStudent = await prisma.user.update({
    where: { id },
    data: { status: 'ACTIVE' },
    select: {
      id: true,
      email: true,
      status: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return {
    student: updatedStudent,
    message: 'Student activated successfully',
  };
};

export const updateStudentProfile = async (userId: string, input: UpdateStudentProfileInput) => {
  const student = await prisma.user.findFirst({
    where: { id: userId, role: 'STUDENT' },
  });

  if (!student) {
    throw new NotFoundError('Student not found');
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId },
    data: input,
  });

  return updatedProfile;
};

export const getStudentStats = async () => {
  const [total, byStatus] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.groupBy({
      by: ['status'],
      where: { role: 'STUDENT' },
      _count: true,
    }),
  ]);

  const totalEnrollments = await prisma.enrollment.count();

  return {
    total,
    totalEnrollments,
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
  };
};

export const deleteStudent = async (id: string) => {
  const student = await prisma.user.findFirst({
    where: { id, role: 'STUDENT' },
  });

  if (!student) {
    throw new NotFoundError('Student not found');
  }

  await prisma.user.delete({ where: { id } });

  return { message: 'Student deleted successfully' };
};
