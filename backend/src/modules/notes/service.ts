import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import type { CreateNoteInput, UpdateNoteInput } from './types';

export const createNote = async (userId: string, input: CreateNoteInput) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: input.courseId } },
  });

  if (!enrollment) throw new ValidationError('You must be enrolled in this course to add notes');

  const note = await prisma.studentNote.create({
    data: {
      userId,
      courseId: input.courseId,
      title: input.title,
      content: input.content,
    },
  });

  return note;
};

export const getNotesByCourse = async (userId: string, courseId: string) => {
  const notes = await prisma.studentNote.findMany({
    where: { userId, courseId },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  return notes;
};

export const getNoteById = async (userId: string, noteId: string) => {
  const note = await prisma.studentNote.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) throw new NotFoundError('Note not found');
  return note;
};

export const updateNote = async (userId: string, noteId: string, input: UpdateNoteInput) => {
  const note = await prisma.studentNote.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) throw new NotFoundError('Note not found');

  const updatedNote = await prisma.studentNote.update({
    where: { id: noteId },
    data: input,
  });

  return updatedNote;
};

export const deleteNote = async (userId: string, noteId: string) => {
  const note = await prisma.studentNote.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) throw new NotFoundError('Note not found');

  await prisma.studentNote.delete({ where: { id: noteId } });
  return { message: 'Note deleted successfully' };
};
