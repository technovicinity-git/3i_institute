import { Router } from 'express';
import * as waiverController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { createWaiverSchema, processWaiverSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/waiver:
 *   post:
 *     tags: [Waiver]
 *     summary: Submit waiver request (Student only)
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
 *               - reason
 *             properties:
 *               courseId:
 *                 type: string
 *               reason:
 *                 type: string
 *               supportingInfo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Waiver request submitted
 */
router.post(
  '/',
  authenticate,
  authorize('STUDENT'),
  validate(createWaiverSchema),
  waiverController.createWaiverRequest,
);

/**
 * @swagger
 * /api/v1/waiver/mine:
 *   get:
 *     tags: [Waiver]
 *     summary: Get my waiver requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My waiver requests
 */
router.get('/mine', authenticate, waiverController.getMyWaiverRequests);

/**
 * @swagger
 * /api/v1/waiver:
 *   get:
 *     tags: [Waiver]
 *     summary: Get all waiver requests (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Waiver requests
 */
router.get('/', authenticate, authorize('ADMIN'), waiverController.getWaiverRequests);

/**
 * @swagger
 * /api/v1/waiver/{id}/process:
 *   patch:
 *     tags: [Waiver]
 *     summary: Process waiver request (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approved
 *             properties:
 *               approved:
 *                 type: boolean
 *               discountPercentage:
 *                 type: number
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Waiver processed
 */
router.patch(
  '/:id/process',
  authenticate,
  authorize('ADMIN'),
  validate(processWaiverSchema),
  waiverController.processWaiverRequest,
);

export default router;
