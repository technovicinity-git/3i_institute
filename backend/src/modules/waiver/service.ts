import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import { CreateWaiverInput } from './types';

export const createWaiverRequest = async (userId: string, input: CreateWaiverInput) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: input.courseId } },
  });

  if (!enrollment) throw new ValidationError('Must be enrolled in the course first');

  const existingRequest = await prisma.waiverRequest.findFirst({
    where: { userId, courseId: input.courseId, status: 'PENDING' },
  });

  if (existingRequest)
    throw new ValidationError('Already have a pending waiver request for this course');

  const waiver = await prisma.waiverRequest.create({
    data: {
      userId,
      courseId: input.courseId,
      reason: input.reason,
      supportingInfo: input.supportingInfo,
    },
    include: {
      course: {
        select: { id: true, title: true },
      },
    },
  });

  return waiver;
};

export const getWaiverRequests = async (filters: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const { status, page = 1, limit = 20 } = filters;

  const where: any = {};
  if (status) where.status = status;

  const [requests, total] = await Promise.all([
    prisma.waiverRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        course: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.waiverRequest.count({ where }),
  ]);

  return {
    requests,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getMyWaiverRequests = async (userId: string) => {
  const requests = await prisma.waiverRequest.findMany({
    where: { userId },
    include: {
      course: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return requests;
};

export const processWaiverRequest = async (
  id: string,
  input: { approved: boolean; discountPercentage?: number; reason?: string },
) => {
  const waiver = await prisma.waiverRequest.findUnique({ where: { id } });
  if (!waiver) throw new NotFoundError('Waiver request not found');
  if (waiver.status !== 'PENDING') throw new ValidationError('Request already processed');

  const updatedWaiver = await prisma.waiverRequest.update({
    where: { id },
    data: {
      status: input.approved ? 'APPROVED' : 'REJECTED',
      discountPercentage: input.discountPercentage || 0,
      rejectionReason: input.reason,
      processedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: {
            select: { firstName: true, lastName: true },
          },
        },
      },
      course: {
        select: { id: true, title: true },
      },
    },
  });

  return {
    waiver: updatedWaiver,
    message: input.approved
      ? `Waiver approved with ${input.discountPercentage || 0}% discount`
      : 'Waiver rejected',
  };
};
