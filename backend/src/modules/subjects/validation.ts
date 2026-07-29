import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  description: z.string().max(500).optional(),
  topicId: z.string().uuid('Invalid topic ID'),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  description: z.string().max(500).optional(),
  topicId: z.string().uuid('Invalid topic ID').optional(),
  isActive: z.boolean().optional(),
});
