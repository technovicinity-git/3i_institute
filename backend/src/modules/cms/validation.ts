import { z } from 'zod';

export const createPageSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens')
    .trim(),
  title: z.string().min(1).max(200).trim(),
  content: z.string().min(1),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  isPublished: z.boolean().optional(),
});

export const updatePageSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  content: z.string().min(1).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  isPublished: z.boolean().optional(),
});

export const createBannerSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  subtitle: z.string().max(500).optional(),
  imageUrl: z.string().url('Invalid image URL'),
  linkUrl: z.string().url().optional(),
  order: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  content: z.string().min(1).max(2000),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  expiresAt: z.string().optional(),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email(),
  subject: z.string().min(1).max(200).trim(),
  message: z.string().min(10).max(3000).trim(),
  phone: z.string().max(20).optional(),
});
