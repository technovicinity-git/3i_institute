import { Router } from 'express';
import * as wishlistController from './controller';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get my wishlist (Student only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist items
 */
router.get('/', authenticate, authorize('STUDENT'), wishlistController.getWishlist);

/**
 * @swagger
 * /api/v1/wishlist:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add course to wishlist (Student only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Added to wishlist
 */
router.post('/', authenticate, authorize('STUDENT'), wishlistController.addToWishlist);

/**
 * @swagger
 * /api/v1/wishlist/{courseId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove course from wishlist (Student only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed from wishlist
 */
router.delete(
  '/:courseId',
  authenticate,
  authorize('STUDENT'),
  wishlistController.removeFromWishlist,
);

export default router;
