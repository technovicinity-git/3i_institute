import { z } from 'zod';

export const createNoteSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  title: z.string().min(1, 'Title is required').max(200).trim(),
  content: z.string().min(1, 'Content is required'),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  content: z.string().min(1).optional(),
});
