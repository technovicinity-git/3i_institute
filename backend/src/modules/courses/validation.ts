import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).trim(),
  description: z.string().max(2000).optional(),
  thumbnail: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  topicId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  type: z.enum(['REGULAR', 'ONLINE', 'MIXED']).optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(2000).optional(),
  thumbnail: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  topicId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  type: z.enum(['REGULAR', 'ONLINE', 'MIXED']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SUSPENDED']).optional(),
});
