import { Router } from 'express';
import * as subjectController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { createSubjectSchema, updateSubjectSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/subjects:
 *   get:
 *     tags: [Subjects]
 *     summary: Get all subjects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subjects
 */
router.get('/', authenticate, subjectController.getSubjects);

/**
 * @swagger
 * /api/v1/subjects/{id}:
 *   get:
 *     tags: [Subjects]
 *     summary: Get subject by ID
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
 *         description: Subject details
 */
router.get('/:id', authenticate, subjectController.getSubjectById);

/**
 * @swagger
 * /api/v1/subjects/topic/{topicId}:
 *   get:
 *     tags: [Subjects]
 *     summary: Get subjects by topic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subjects for topic
 */
router.get('/topic/:topicId', authenticate, subjectController.getSubjectsByTopic);

/**
 * @swagger
 * /api/v1/subjects:
 *   post:
 *     tags: [Subjects]
 *     summary: Create a subject (Admin only)
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
 *               - topicId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               topicId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Subject created
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createSubjectSchema),
  subjectController.createSubject,
);

/**
 * @swagger
 * /api/v1/subjects/{id}:
 *   patch:
 *     tags: [Subjects]
 *     summary: Update a subject (Admin only)
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
 *               topicId:
 *                 type: string
 *                 format: uuid
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subject updated
 */
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateSubjectSchema),
  subjectController.updateSubject,
);

/**
 * @swagger
 * /api/v1/subjects/{id}:
 *   delete:
 *     tags: [Subjects]
 *     summary: Delete a subject (Admin only)
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
 *         description: Subject deleted
 */
router.delete('/:id', authenticate, authorize('ADMIN'), subjectController.deleteSubject);

/**
 * @swagger
 * /api/v1/subjects/{id}/toggle-status:
 *   patch:
 *     tags: [Subjects]
 *     summary: Toggle subject active status (Admin only)
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
  subjectController.toggleSubjectStatus,
);

export default router;
