import { Router } from 'express';
import * as noteController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { createNoteSchema, updateNoteSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/notes/course/{courseId}:
 *   get:
 *     tags: [Notes]
 *     summary: Get notes for a course (Student only)
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
 *         description: List of notes
 */
router.get(
  '/course/:courseId',
  authenticate,
  authorize('STUDENT'),
  noteController.getNotesByCourse,
);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Get note by ID (Student only)
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
 *         description: Note details
 */
router.get('/:id', authenticate, authorize('STUDENT'), noteController.getNoteById);

/**
 * @swagger
 * /api/v1/notes:
 *   post:
 *     tags: [Notes]
 *     summary: Create a note (Student only)
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
 *               - title
 *               - content
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created
 */
router.post(
  '/',
  authenticate,
  authorize('STUDENT'),
  validate(createNoteSchema),
  noteController.createNote,
);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   patch:
 *     tags: [Notes]
 *     summary: Update a note (Student only, own notes)
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 */
router.patch(
  '/:id',
  authenticate,
  authorize('STUDENT'),
  validate(updateNoteSchema),
  noteController.updateNote,
);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Delete a note (Student only, own notes)
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
 *         description: Note deleted
 */
router.delete('/:id', authenticate, authorize('STUDENT'), noteController.deleteNote);

export default router;
