import { Router } from 'express';
import * as cmsController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import {
  createPageSchema,
  updatePageSchema,
  createBannerSchema,
  createAnnouncementSchema,
  contactMessageSchema,
} from './validation';

const router: Router = Router();

// Public routes
router.get('/pages/slug/:slug', cmsController.getPageBySlug);
router.get('/banners', cmsController.getBanners);
router.get('/announcements', cmsController.getAnnouncements);
router.post('/contact', validate(contactMessageSchema), cmsController.submitContactMessage);

// Admin routes
router.get('/pages', authenticate, authorize('ADMIN'), cmsController.getPages);
router.get('/pages/:id', authenticate, authorize('ADMIN'), cmsController.getPageById);
router.post(
  '/pages',
  authenticate,
  authorize('ADMIN'),
  validate(createPageSchema),
  cmsController.createPage,
);
router.patch(
  '/pages/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updatePageSchema),
  cmsController.updatePage,
);
router.delete('/pages/:id', authenticate, authorize('ADMIN'), cmsController.deletePage);

router.get('/admin/banners', authenticate, authorize('ADMIN'), cmsController.getAllBanners);
router.post(
  '/banners',
  authenticate,
  authorize('ADMIN'),
  validate(createBannerSchema),
  cmsController.createBanner,
);
router.patch('/banners/:id', authenticate, authorize('ADMIN'), cmsController.updateBanner);
router.delete('/banners/:id', authenticate, authorize('ADMIN'), cmsController.deleteBanner);

router.get(
  '/admin/announcements',
  authenticate,
  authorize('ADMIN'),
  cmsController.getAllAnnouncements,
);
router.post(
  '/announcements',
  authenticate,
  authorize('ADMIN'),
  validate(createAnnouncementSchema),
  cmsController.createAnnouncement,
);
router.patch(
  '/announcements/:id',
  authenticate,
  authorize('ADMIN'),
  cmsController.updateAnnouncement,
);
router.delete(
  '/announcements/:id',
  authenticate,
  authorize('ADMIN'),
  cmsController.deleteAnnouncement,
);

router.get('/contact-messages', authenticate, authorize('ADMIN'), cmsController.getContactMessages);
router.patch(
  '/contact-messages/:id/read',
  authenticate,
  authorize('ADMIN'),
  cmsController.markContactMessageRead,
);
router.delete(
  '/contact-messages/:id',
  authenticate,
  authorize('ADMIN'),
  cmsController.deleteContactMessage,
);

export default router;
