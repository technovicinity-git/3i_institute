import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import type {
  CreateBatchInput,
  UpdateBatchInput,
  CreateSessionInput,
  UpdateSessionInput,
} from './types';

export const createBatch = async (teacherId: string, input: CreateBatchInput) => {
  const course = await prisma.course.findUnique({ where: { id: input.courseId } });
  if (!course) throw new NotFoundError('Course not found');
  if (course.teacherId !== teacherId)
    throw new ValidationError('You can only create batches for your own courses');
  if (course.type !== 'ONLINE' && course.type !== 'MIXED') {
    throw new ValidationError('Batches can only be created for online or mixed courses');
  }

  const batch = await prisma.batch.create({
    data: {
      name: input.name,
      capacity: input.capacity,
      courseId: input.courseId,
      sessions: {
        create: input.sessions.map((s) => ({
          title: s.title,
          date: new Date(s.date),
          time: s.time,
          notes: s.notes,
        })),
      },
    },
    include: {
      sessions: {
        orderBy: { date: 'asc' },
      },
    },
  });

  return batch;
};

export const getBatchesByCourse = async (courseId: string) => {
  const batches = await prisma.batch.findMany({
    where: { courseId },
    include: {
      sessions: {
        orderBy: { date: 'asc' },
      },
      _count: {
        select: { students: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return batches;
};

export const getBatchById = async (id: string) => {
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      sessions: {
        orderBy: { date: 'asc' },
      },
      course: {
        select: { id: true, title: true, type: true },
      },
      students: {
        select: {
          id: true,
          profile: {
            select: { firstName: true, lastName: true, avatar: true },
          },
        },
      },
      _count: {
        select: { students: true },
      },
    },
  });

  if (!batch) throw new NotFoundError('Batch not found');
  return batch;
};

export const updateBatch = async (id: string, teacherId: string, input: UpdateBatchInput) => {
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!batch) throw new NotFoundError('Batch not found');
  if (batch.course.teacherId !== teacherId)
    throw new ValidationError('You can only update your own batches');

  const updatedBatch = await prisma.batch.update({
    where: { id },
    data: input,
    include: {
      sessions: { orderBy: { date: 'asc' } },
    },
  });

  return updatedBatch;
};

export const closeBatch = async (id: string, teacherId: string) => {
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!batch) throw new NotFoundError('Batch not found');
  if (batch.course.teacherId !== teacherId)
    throw new ValidationError('You can only close your own batches');

  const updatedBatch = await prisma.batch.update({
    where: { id },
    data: { isClosed: true },
  });

  return { batch: updatedBatch, message: 'Batch closed successfully' };
};

export const reopenBatch = async (id: string, teacherId: string) => {
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!batch) throw new NotFoundError('Batch not found');
  if (batch.course.teacherId !== teacherId)
    throw new ValidationError('You can only reopen your own batches');

  const updatedBatch = await prisma.batch.update({
    where: { id },
    data: { isClosed: false },
  });

  return { batch: updatedBatch, message: 'Batch reopened successfully' };
};

export const deleteBatch = async (id: string, teacherId: string) => {
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!batch) throw new NotFoundError('Batch not found');
  if (batch.course.teacherId !== teacherId)
    throw new ValidationError('You can only delete your own batches');

  await prisma.batch.delete({ where: { id } });
  return { message: 'Batch deleted successfully' };
};

export const addSession = async (batchId: string, teacherId: string, input: CreateSessionInput) => {
  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: { course: true },
  });

  if (!batch) throw new NotFoundError('Batch not found');
  if (batch.course.teacherId !== teacherId)
    throw new ValidationError('You can only add sessions to your own batches');

  const session = await prisma.batchSession.create({
    data: {
      batchId,
      title: input.title,
      date: new Date(input.date),
      time: input.time,
      notes: input.notes,
    },
  });

  return session;
};

export const updateSession = async (
  sessionId: string,
  teacherId: string,
  input: UpdateSessionInput,
) => {
  const session = await prisma.batchSession.findUnique({
    where: { id: sessionId },
    include: { batch: { include: { course: true } } },
  });

  if (!session) throw new NotFoundError('Session not found');
  if (session.batch.course.teacherId !== teacherId)
    throw new ValidationError('You can only update your own sessions');

  const updatedSession = await prisma.batchSession.update({
    where: { id: sessionId },
    data: input,
  });

  return updatedSession;
};

export const deleteSession = async (sessionId: string, teacherId: string) => {
  const session = await prisma.batchSession.findUnique({
    where: { id: sessionId },
    include: { batch: { include: { course: true } } },
  });

  if (!session) throw new NotFoundError('Session not found');
  if (session.batch.course.teacherId !== teacherId)
    throw new ValidationError('You can only delete your own sessions');

  await prisma.batchSession.delete({ where: { id: sessionId } });
  return { message: 'Session deleted successfully' };
};

export const joinBatch = async (batchId: string, userId: string) => {
  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: { _count: { select: { students: true } } },
  });

  if (!batch) throw new NotFoundError('Batch not found');
  if (batch.isClosed) throw new ValidationError('Batch is closed');
  if (batch._count.students >= batch.capacity) throw new ValidationError('Batch is full');

  const existingStudent = await prisma.batchStudent.findUnique({
    where: { batchId_userId: { batchId, userId } },
  });

  if (existingStudent) throw new ValidationError('Already joined this batch');

  await prisma.batchStudent.create({
    data: { batchId, userId },
  });

  return { message: 'Successfully joined the batch' };
};

export const leaveBatch = async (batchId: string, userId: string) => {
  const student = await prisma.batchStudent.findUnique({
    where: { batchId_userId: { batchId, userId } },
  });

  if (!student) throw new NotFoundError('Not enrolled in this batch');

  await prisma.batchStudent.delete({
    where: { batchId_userId: { batchId, userId } },
  });

  return { message: 'Successfully left the batch' };
};
