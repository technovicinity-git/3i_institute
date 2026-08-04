import { Router } from 'express';
import * as questionController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { createMCQSchema, createShortQuestionSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/questions:
 *   get:
 *     tags: [Questions]
 *     summary: Get all questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [MCQ, SHORT]
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *         description: List of questions
 */
router.get('/', authenticate, authorize('TEACHER', 'ADMIN'), questionController.getQuestions);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   get:
 *     tags: [Questions]
 *     summary: Get question by ID
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
 *         description: Question details
 */
router.get('/:id', authenticate, authorize('TEACHER', 'ADMIN'), questionController.getQuestionById);

/**
 * @swagger
 * /api/v1/questions/mcq:
 *   post:
 *     tags: [Questions]
 *     summary: Create MCQ question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - options
 *               - correctAnswer
 *               - marks
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 4
 *                 maxItems: 4
 *               correctAnswer:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 3
 *               marks:
 *                 type: integer
 *               courseId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: MCQ created
 */
router.post(
  '/mcq',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  validate(createMCQSchema),
  questionController.createMCQ,
);

/**
 * @swagger
 * /api/v1/questions/short:
 *   post:
 *     tags: [Questions]
 *     summary: Create short answer question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - marks
 *             properties:
 *               question:
 *                 type: string
 *               suggestedAnswer:
 *                 type: string
 *               marks:
 *                 type: integer
 *               courseId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Question created
 */
router.post(
  '/short',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  validate(createShortQuestionSchema),
  questionController.createShortQuestion,
);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   patch:
 *     tags: [Questions]
 *     summary: Update a question
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
 *     responses:
 *       200:
 *         description: Question updated
 */
router.patch(
  '/:id',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  questionController.updateQuestion,
);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   delete:
 *     tags: [Questions]
 *     summary: Delete a question
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
 *         description: Question deleted
 */
router.delete(
  '/:id',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  questionController.deleteQuestion,
);

export default router;
