import { z } from 'zod';

export const uploadMaterialSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  title: z.string().min(1, 'Title is required').max(200).trim(),
  description: z.string().max(1000).optional(),
  type: z.enum(['VIDEO', 'PDF', 'AUDIO', 'IMAGE', 'DOCUMENT']),
  url: z.string().url('Invalid URL'),
  duration: z.number().min(0).optional(),
  order: z.number().min(0).optional(),
});
