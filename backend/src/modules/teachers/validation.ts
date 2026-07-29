import { z } from 'zod';

export const teacherFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const approveTeacherSchema = z.object({
  approved: z.boolean(),
  reason: z.string().max(500).optional(),
});

export const updateTeacherProfileSchema = z.object({
  firstName: z.string().min(1).max(50).trim().optional(),
  lastName: z.string().min(1).max(50).trim().optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(1000).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  academicInfo: z.string().max(2000).optional(),
  professionalExperience: z.string().max(2000).optional(),
});

export const cvUploadSchema = z.object({
  filename: z.string().min(1),
  mimetype: z.string(),
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
});
