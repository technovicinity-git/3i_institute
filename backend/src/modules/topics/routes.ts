import { Router } from 'express';
import * as topicController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { createTopicSchema, updateTopicSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/topics:
 *   get:
 *     tags: [Topics]
 *     summary: Get all topics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of topics
 */
router.get('/', authenticate, topicController.getTopics);

/**
 * @swagger
 * /api/v1/topics/{id}:
 *   get:
 *     tags: [Topics]
 *     summary: Get topic by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topic details
 */
router.get('/:id', authenticate, topicController.getTopicById);

/**
 * @swagger
 * /api/v1/topics:
 *   post:
 *     tags: [Topics]
 *     summary: Create a topic (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Topic created
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createTopicSchema),
  topicController.createTopic,
);

/**
 * @swagger
 * /api/v1/topics/{id}:
 *   patch:
 *     tags: [Topics]
 *     summary: Update a topic (Admin only)
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Topic updated
 */
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateTopicSchema),
  topicController.updateTopic,
);

/**
 * @swagger
 * /api/v1/topics/{id}:
 *   delete:
 *     tags: [Topics]
 *     summary: Delete a topic (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topic deleted
 */
router.delete('/:id', authenticate, authorize('ADMIN'), topicController.deleteTopic);

/**
 * @swagger
 * /api/v1/topics/{id}/toggle-status:
 *   patch:
 *     tags: [Topics]
 *     summary: Toggle topic active status (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status toggled
 */
router.patch(
  '/:id/toggle-status',
  authenticate,
  authorize('ADMIN'),
  topicController.toggleTopicStatus,
);

export default router;
