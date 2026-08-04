import { Router } from 'express';
import * as examController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { createExamSchema, submitExamSchema, reviewAnswerSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/exams/course/{courseId}:
 *   get:
 *     tags: [Exams]
 *     summary: Get all exams for a course
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of exams
 */
router.get('/course/:courseId', examController.getCourseExams);

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   get:
 *     tags: [Exams]
 *     summary: Get exam by ID (teacher view)
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
 *         description: Exam details
 */
router.get('/:id', authenticate, authorize('TEACHER', 'ADMIN'), examController.getExamById);

/**
 * @swagger
 * /api/v1/exams/{id}/take:
 *   get:
 *     tags: [Exams]
 *     summary: Get exam for taking (student view - no answers)
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
 *         description: Exam questions without answers
 */
router.get('/:id/take', authenticate, authorize('STUDENT'), examController.getExamForStudent);

/**
 * @swagger
 * /api/v1/exams:
 *   post:
 *     tags: [Exams]
 *     summary: Create an exam (Teacher only)
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
 *               - duration
 *               - passingMarks
 *               - totalMarks
 *               - questions
 *             properties:
 *               courseId:
 *                 type: string
 *               title:
 *                 type: string
 *               duration:
 *                 type: integer
 *               passingMarks:
 *                 type: integer
 *               totalMarks:
 *                 type: integer
 *               isFinalExam:
 *                 type: boolean
 *               randomOrder:
 *                 type: boolean
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     marks:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Exam created
 */
router.post(
  '/',
  authenticate,
  authorize('TEACHER'),
  validate(createExamSchema),
  examController.createExam,
);

/**
 * @swagger
 * /api/v1/exams/submit:
 *   post:
 *     tags: [Exams]
 *     summary: Submit exam answers (Student only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examPaperId
 *               - answers
 *             properties:
 *               examPaperId:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     answer:
 *                       type: string
 *     responses:
 *       201:
 *         description: Exam submitted
 */
router.post(
  '/submit',
  authenticate,
  authorize('STUDENT'),
  validate(submitExamSchema),
  examController.submitExam,
);

/**
 * @swagger
 * /api/v1/exams/mine:
 *   get:
 *     tags: [Exams]
 *     summary: Get my exam history (Student only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student exam history
 */
router.get('/mine', authenticate, authorize('STUDENT'), examController.getStudentExams);

/**
 * @swagger
 * /api/v1/exams/{id}/results:
 *   get:
 *     tags: [Exams]
 *     summary: Get exam results (Teacher only)
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
 *         description: Student results
 */
router.get('/:id/results', authenticate, authorize('TEACHER'), examController.getExamResults);

/**
 * @swagger
 * /api/v1/exams/{studentExamId}/review/{questionId}:
 *   patch:
 *     tags: [Exams]
 *     summary: Review a written answer (Teacher only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentExamId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: questionId
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
 *               - marks
 *             properties:
 *               marks:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Answer reviewed
 */
router.patch(
  '/:studentExamId/review/:questionId',
  authenticate,
  authorize('TEACHER'),
  validate(reviewAnswerSchema),
  examController.reviewAnswer,
);

/**
 * @swagger
 * /api/v1/exams/{id}:
 *   delete:
 *     tags: [Exams]
 *     summary: Delete an exam (Teacher only)
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
 *         description: Exam deleted
 */
router.delete('/:id', authenticate, authorize('TEACHER'), examController.deleteExam);

export default router;
