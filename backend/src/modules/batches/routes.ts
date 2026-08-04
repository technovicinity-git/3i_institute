import { Router } from 'express';
import * as batchController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import {
  createBatchSchema,
  updateBatchSchema,
  createSessionSchema,
  updateSessionSchema,
} from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/batches/course/{courseId}:
 *   get:
 *     tags: [Batches]
 *     summary: Get all batches for a course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of batches
 */
router.get('/course/:courseId', batchController.getBatchesByCourse);

/**
 * @swagger
 * /api/v1/batches/{id}:
 *   get:
 *     tags: [Batches]
 *     summary: Get batch by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Batch details
 */
router.get('/:id', batchController.getBatchById);

/**
 * @swagger
 * /api/v1/batches:
 *   post:
 *     tags: [Batches]
 *     summary: Create a batch (Teacher only)
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
 *               - name
 *               - capacity
 *               - sessions
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               sessions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - date
 *                     - time
 *                   properties:
 *                     title:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     time:
 *                       type: string
 *                     notes:
 *                       type: string
 *     responses:
 *       201:
 *         description: Batch created
 */
router.post(
  '/',
  authenticate,
  authorize('TEACHER'),
  validate(createBatchSchema),
  batchController.createBatch,
);

/**
 * @swagger
 * /api/v1/batches/{id}:
 *   patch:
 *     tags: [Batches]
 *     summary: Update a batch (Teacher only, own batches)
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
 *               capacity:
 *                 type: integer
 *               isClosed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Batch updated
 */
router.patch(
  '/:id',
  authenticate,
  authorize('TEACHER'),
  validate(updateBatchSchema),
  batchController.updateBatch,
);

/**
 * @swagger
 * /api/v1/batches/{id}/close:
 *   patch:
 *     tags: [Batches]
 *     summary: Close a batch (Teacher only, own batches)
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
 *         description: Batch closed
 */
router.patch('/:id/close', authenticate, authorize('TEACHER'), batchController.closeBatch);

/**
 * @swagger
 * /api/v1/batches/{id}/reopen:
 *   patch:
 *     tags: [Batches]
 *     summary: Reopen a batch (Teacher only, own batches)
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
 *         description: Batch reopened
 */
router.patch('/:id/reopen', authenticate, authorize('TEACHER'), batchController.reopenBatch);

/**
 * @swagger
 * /api/v1/batches/{id}:
 *   delete:
 *     tags: [Batches]
 *     summary: Delete a batch (Teacher only, own batches)
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
 *         description: Batch deleted
 */
router.delete('/:id', authenticate, authorize('TEACHER'), batchController.deleteBatch);

/**
 * @swagger
 * /api/v1/batches/{batchId}/sessions:
 *   post:
 *     tags: [Batches]
 *     summary: Add a session to batch (Teacher only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
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
 *               - title
 *               - date
 *               - time
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Session added
 */
router.post(
  '/:batchId/sessions',
  authenticate,
  authorize('TEACHER'),
  validate(createSessionSchema),
  batchController.addSession,
);

/**
 * @swagger
 * /api/v1/batches/sessions/{sessionId}:
 *   patch:
 *     tags: [Batches]
 *     summary: Update a session (Teacher only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
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
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               notes:
 *                 type: string
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Session updated
 */
router.patch(
  '/sessions/:sessionId',
  authenticate,
  authorize('TEACHER'),
  validate(updateSessionSchema),
  batchController.updateSession,
);

/**
 * @swagger
 * /api/v1/batches/sessions/{sessionId}:
 *   delete:
 *     tags: [Batches]
 *     summary: Delete a session (Teacher only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session deleted
 */
router.delete(
  '/sessions/:sessionId',
  authenticate,
  authorize('TEACHER'),
  batchController.deleteSession,
);

/**
 * @swagger
 * /api/v1/batches/{id}/join:
 *   post:
 *     tags: [Batches]
 *     summary: Join a batch (Student only)
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
 *         description: Successfully joined
 */
router.post('/:id/join', authenticate, authorize('STUDENT'), batchController.joinBatch);

/**
 * @swagger
 * /api/v1/batches/{id}/leave:
 *   post:
 *     tags: [Batches]
 *     summary: Leave a batch (Student only)
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
 *         description: Successfully left
 */
router.post('/:id/leave', authenticate, authorize('STUDENT'), batchController.leaveBatch);

export default router;
