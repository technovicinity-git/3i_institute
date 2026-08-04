import { z } from 'zod';

export const createMCQSchema = z.object({
  question: z.string().min(1, 'Question is required').max(2000).trim(),
  options: z.array(z.string().min(1)).length(4, 'Exactly 4 options required'),
  correctAnswer: z.number().min(0).max(3, 'Correct answer must be between 0-3'),
  marks: z.number().min(1, 'Marks must be at least 1').max(100),
  courseId: z.string().uuid().optional(),
});

export const createShortQuestionSchema = z.object({
  question: z.string().min(1, 'Question is required').max(2000).trim(),
  suggestedAnswer: z.string().max(3000).optional(),
  marks: z.number().min(1, 'Marks must be at least 1').max(100),
  courseId: z.string().uuid().optional(),
});

export const questionFiltersSchema = z.object({
  type: z.enum(['MCQ', 'SHORT']).optional(),
  courseId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
