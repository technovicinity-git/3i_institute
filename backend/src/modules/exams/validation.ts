import { z } from 'zod';

export const createExamSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  title: z.string().min(1, 'Title is required').max(200).trim(),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute').max(480),
  passingMarks: z.number().int().min(1, 'Passing marks required'),
  totalMarks: z.number().int().min(1, 'Total marks required'),
  isFinalExam: z.boolean().optional(),
  randomOrder: z.boolean().optional(),
  questions: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        marks: z.number().int().min(1),
      }),
    )
    .min(1, 'At least one question required'),
});

export const submitExamSchema = z.object({
  examPaperId: z.string().uuid(),
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        answer: z.string().min(1),
      }),
    )
    .min(1),
});

export const reviewAnswerSchema = z.object({
  marks: z.number().int().min(0),
});
