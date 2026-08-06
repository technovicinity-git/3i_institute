import { Request, Response, NextFunction } from 'express';
import * as cmsService from './service';
import { sendSuccess } from '@/common/responses/api-response';

// Pages
export const createPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await cmsService.createPage(req.body);
    sendSuccess({ res, statusCode: 201, data: page });
  } catch (error) {
    next(error);
  }
};

export const getPages = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const pages = await cmsService.getPages();
    sendSuccess({ res, data: pages });
  } catch (error) {
    next(error);
  }
};

export const getPageBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await cmsService.getPageBySlug(req.params.slug as string);
    sendSuccess({ res, data: page });
  } catch (error) {
    next(error);
  }
};

export const getPageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await cmsService.getPageById(req.params.id as string);
    sendSuccess({ res, data: page });
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = await cmsService.updatePage(req.params.id as string, req.body);
    sendSuccess({ res, message: 'Page updated', data: page });
  } catch (error) {
    next(error);
  }
};

export const deletePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cmsService.deletePage(req.params.id as string);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

// Banners
export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await cmsService.createBanner(req.body);
    sendSuccess({ res, statusCode: 201, data: banner });
  } catch (error) {
    next(error);
  }
};

export const getBanners = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await cmsService.getBanners();
    sendSuccess({ res, data: banners });
  } catch (error) {
    next(error);
  }
};

export const getAllBanners = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await cmsService.getAllBanners();
    sendSuccess({ res, data: banners });
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await cmsService.updateBanner(req.params.id as string, req.body);
    sendSuccess({ res, message: 'Banner updated', data: banner });
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cmsService.deleteBanner(req.params.id as string);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

// Announcements
export const createAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const announcement = await cmsService.createAnnouncement(req.body);
    sendSuccess({ res, statusCode: 201, data: announcement });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const announcements = await cmsService.getAnnouncements();
    sendSuccess({ res, data: announcements });
  } catch (error) {
    next(error);
  }
};

export const getAllAnnouncements = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const announcements = await cmsService.getAllAnnouncements();
    sendSuccess({ res, data: announcements });
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const announcement = await cmsService.updateAnnouncement(req.params.id as string, req.body);
    sendSuccess({ res, message: 'Announcement updated', data: announcement });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cmsService.deleteAnnouncement(req.params.id as string);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

// Contact
export const submitContactMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await cmsService.submitContactMessage(req.body);
    sendSuccess({ res, statusCode: 201, message: 'Message sent', data: message });
  } catch (error) {
    next(error);
  }
};

export const getContactMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cmsService.getContactMessages(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 20,
    );
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const markContactMessageRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cmsService.markContactMessageRead(req.params.id as string);
    sendSuccess({ res, message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cmsService.deleteContactMessage(req.params.id as string);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};
