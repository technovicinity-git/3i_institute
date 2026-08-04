import { z } from 'zod';

export const createSessionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).trim(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  notes: z.string().max(1000).optional(),
});

export const createBatchSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  name: z.string().min(1, 'Batch name is required').max(100).trim(),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').max(500),
  sessions: z.array(createSessionSchema).min(1, 'At least one session is required'),
});

export const updateBatchSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  capacity: z.number().int().min(1).max(500).optional(),
  isClosed: z.boolean().optional(),
});

export const updateSessionSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  notes: z.string().max(1000).optional(),
  isCompleted: z.boolean().optional(),
});
