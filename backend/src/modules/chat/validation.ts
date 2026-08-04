import { z } from 'zod';

export const sendMessageSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  message: z.string().min(1, 'Message is required').max(2000).trim(),
});
