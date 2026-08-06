import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import type {
  CreatePageInput,
  UpdatePageInput,
  CreateBannerInput,
  CreateAnnouncementInput,
  ContactMessageInput,
} from './types';

// Pages
export const createPage = async (input: CreatePageInput) => {
  const existing = await prisma.cmsPage.findUnique({ where: { slug: input.slug } });
  if (existing) throw new ValidationError('Page with this slug already exists');

  return prisma.cmsPage.create({ data: input });
};

export const getPages = async () => {
  return prisma.cmsPage.findMany({ orderBy: { updatedAt: 'desc' } });
};

export const getPageBySlug = async (slug: string) => {
  const page = await prisma.cmsPage.findUnique({ where: { slug, isPublished: true } });
  if (!page) throw new NotFoundError('Page not found');
  return page;
};

export const getPageById = async (id: string) => {
  const page = await prisma.cmsPage.findUnique({ where: { id } });
  if (!page) throw new NotFoundError('Page not found');
  return page;
};

export const updatePage = async (id: string, input: UpdatePageInput) => {
  const page = await prisma.cmsPage.findUnique({ where: { id } });
  if (!page) throw new NotFoundError('Page not found');

  return prisma.cmsPage.update({ where: { id }, data: input });
};

export const deletePage = async (id: string) => {
  const page = await prisma.cmsPage.findUnique({ where: { id } });
  if (!page) throw new NotFoundError('Page not found');

  await prisma.cmsPage.delete({ where: { id } });
  return { message: 'Page deleted' };
};

// Banners
export const createBanner = async (input: CreateBannerInput) => {
  return prisma.banner.create({ data: input });
};

export const getBanners = async () => {
  return prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
};

export const getAllBanners = async () => {
  return prisma.banner.findMany({ orderBy: { order: 'asc' } });
};

export const updateBanner = async (id: string, input: Partial<CreateBannerInput>) => {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw new NotFoundError('Banner not found');

  return prisma.banner.update({ where: { id }, data: input });
};

export const deleteBanner = async (id: string) => {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw new NotFoundError('Banner not found');

  await prisma.banner.delete({ where: { id } });
  return { message: 'Banner deleted' };
};

// Announcements
export const createAnnouncement = async (input: CreateAnnouncementInput) => {
  return prisma.announcement.create({ data: input });
};

export const getAnnouncements = async () => {
  return prisma.announcement.findMany({
    where: {
      OR: [{ expiresAt: { gte: new Date() } }, { expiresAt: null }],
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAllAnnouncements = async () => {
  return prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
};

export const updateAnnouncement = async (id: string, input: Partial<CreateAnnouncementInput>) => {
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) throw new NotFoundError('Announcement not found');

  return prisma.announcement.update({ where: { id }, data: input });
};

export const deleteAnnouncement = async (id: string) => {
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) throw new NotFoundError('Announcement not found');

  await prisma.announcement.delete({ where: { id } });
  return { message: 'Announcement deleted' };
};

// Contact Messages
export const submitContactMessage = async (input: ContactMessageInput) => {
  return prisma.contactMessage.create({ data: input });
};

export const getContactMessages = async (page = 1, limit = 20) => {
  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contactMessage.count(),
  ]);

  return {
    messages,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const markContactMessageRead = async (id: string) => {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw new NotFoundError('Message not found');

  return prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
};

export const deleteContactMessage = async (id: string) => {
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) throw new NotFoundError('Message not found');

  await prisma.contactMessage.delete({ where: { id } });
  return { message: 'Contact message deleted' };
};

// Footer & Settings
export const getFooterSettings = async () => {
  const settings = await prisma.siteSetting.findMany({
    where: { group: 'FOOTER' },
  });
  return settings;
};

export const updateSiteSetting = async (key: string, value: string) => {
  return prisma.siteSetting.upsert({
    where: { key },
    create: { key, value, group: 'GENERAL' },
    update: { value },
  });
};
