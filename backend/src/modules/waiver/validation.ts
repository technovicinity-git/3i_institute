import { z } from 'zod';

export const createWaiverSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(1000).trim(),
  supportingInfo: z.string().max(1000).optional(),
});

export const processWaiverSchema = z.object({
  approved: z.boolean(),
  discountPercentage: z.number().min(0).max(100).optional(),
  reason: z.string().max(500).optional(),
});
