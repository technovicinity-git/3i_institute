import { z } from 'zod';

export const enrollCourseSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
});
