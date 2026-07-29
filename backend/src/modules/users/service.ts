import prisma from '@/config/database';
import { hashPassword } from '@/common/helpers/password';
import { NotFoundError, ValidationError } from '@/common/errors';
import { Prisma } from '@prisma/client';
import type { CreateUserInput, UpdateUserInput, UserFilters } from './types';

export const createUser = async (input: CreateUserInput) => {
  const { email, password, firstName, lastName, role } = input;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ValidationError('Email already registered');
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          firstName,
          lastName,
        },
      },
    },
    include: {
      profile: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
        },
      },
    },
  });

  return user;
};

export const getUsers = async (filters: UserFilters) => {
  const { search, role, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { profile: { firstName: { contains: search, mode: 'insensitive' } } },
      { profile: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (role) where.role = role;
  if (status) where.status = status;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
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
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export const updateUser = async (id: string, input: UpdateUserInput) => {
  const { firstName, lastName, email, role, status, ...profileData } = input;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (email && email !== user.email) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ValidationError('Email already in use');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(email && { email }),
      ...(role && { role }),
      ...(status && { status }),
      profile: {
        upsert: {
          create: {
            firstName: firstName || '',
            lastName: lastName || '',
            ...profileData,
          },
          update: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...profileData,
          },
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return updatedUser;
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  await prisma.user.delete({ where: { id } });

  return { message: 'User deleted successfully' };
};

export const updateUserStatus = async (id: string, status: 'ACTIVE' | 'SUSPENDED' | 'REJECTED') => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status },
    include: {
      profile: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return updatedUser;
};

export const getUserStats = async () => {
  const [total, byRole, byStatus] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({
      by: ['role'],
      _count: true,
    }),
    prisma.user.groupBy({
      by: ['status'],
      _count: true,
    }),
  ]);

  return {
    total,
    byRole: byRole.map((r) => ({ role: r.role, count: r._count })),
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
  };
};