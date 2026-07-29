import prisma from '@/config/database';
import { NotFoundError, ValidationError, AppError } from '@/common/errors';
import { Prisma } from '@prisma/client';
import type { TeacherFilters, UpdateTeacherProfileInput } from './types';

export const getTeachers = async (filters: TeacherFilters) => {
  const {
    search,
    status,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const where: Prisma.UserWhereInput = {
    role: 'TEACHER',
  };

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { firstName: { contains: search, mode: 'insensitive' } } },
      { profile: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (status) where.status = status;

  const [teachers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            bio: true,
            academicInfo: true,
            professionalExperience: true,
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
    teachers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTeacherById = async (id: string) => {
  const teacher = await prisma.user.findFirst({
    where: { id, role: 'TEACHER' },
    include: {
      profile: true,
    },
  });

  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  return teacher;
};

export const getPendingTeachers = async (filters: TeacherFilters) => {
  const { search, page = 1, limit = 10 } = filters;

  const where: Prisma.UserWhereInput = {
    role: 'TEACHER',
    status: 'PENDING',
  };

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { firstName: { contains: search, mode: 'insensitive' } } },
      { profile: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [teachers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
            bio: true,
            academicInfo: true,
            professionalExperience: true,
            cvUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    teachers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const approveTeacher = async (id: string, approved: boolean, reason?: string) => {
  const teacher = await prisma.user.findFirst({
    where: { id, role: 'TEACHER', status: 'PENDING' },
  });

  if (!teacher) {
    throw new NotFoundError('Pending teacher not found');
  }

  const updatedTeacher = await prisma.user.update({
    where: { id },
    data: {
      status: approved ? 'ACTIVE' : 'REJECTED',
    },
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
    teacher: updatedTeacher,
    message: approved
      ? 'Teacher approved successfully'
      : `Teacher rejected${reason ? `: ${reason}` : ''}`,
  };
};

export const suspendTeacher = async (id: string) => {
  const teacher = await prisma.user.findFirst({
    where: { id, role: 'TEACHER', status: 'ACTIVE' },
  });

  if (!teacher) {
    throw new NotFoundError('Active teacher not found');
  }

  const updatedTeacher = await prisma.user.update({
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
    teacher: updatedTeacher,
    message: 'Teacher suspended successfully',
  };
};

export const activateTeacher = async (id: string) => {
  const teacher = await prisma.user.findFirst({
    where: { id, role: 'TEACHER', status: { in: ['SUSPENDED', 'REJECTED'] } },
  });

  if (!teacher) {
    throw new NotFoundError('Suspended or rejected teacher not found');
  }

  const updatedTeacher = await prisma.user.update({
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
    teacher: updatedTeacher,
    message: 'Teacher activated successfully',
  };
};

export const updateTeacherProfile = async (userId: string, input: UpdateTeacherProfileInput) => {
  const teacher = await prisma.user.findFirst({
    where: { id: userId, role: 'TEACHER' },
  });

  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId },
    data: input,
  });

  return updatedProfile;
};

export const getTeacherStats = async () => {
  const [total, byStatus] = await Promise.all([
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.user.groupBy({
      by: ['status'],
      where: { role: 'TEACHER' },
      _count: true,
    }),
  ]);

  return {
    total,
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
  };
};

export const deleteTeacher = async (id: string) => {
  const teacher = await prisma.user.findFirst({
    where: { id, role: 'TEACHER' },
  });

  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  await prisma.user.delete({ where: { id } });

  return { message: 'Teacher deleted successfully' };
};
