import { Router } from 'express';
import * as studentController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { updateStudentProfileSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/students/stats:
 *   get:
 *     tags: [Students]
 *     summary: Get student statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student statistics
 */
router.get('/stats', authenticate, authorize('ADMIN'), studentController.getStudentStats);

/**
 * @swagger
 * /api/v1/students:
 *   get:
 *     tags: [Students]
 *     summary: Get all students
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACTIVE, SUSPENDED]
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
 *         description: List of students
 */
router.get('/', authenticate, authorize('ADMIN'), studentController.getStudents);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Get student by ID
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
 *         description: Student details
 */
router.get('/:id', authenticate, authorize('ADMIN', 'TEACHER'), studentController.getStudentById);

/**
 * @swagger
 * /api/v1/students/{id}/enrollments:
 *   get:
 *     tags: [Students]
 *     summary: Get student enrollments
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
 *         description: Student enrollments
 */
router.get(
  '/:id/enrollments',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  studentController.getStudentEnrollments,
);

/**
 * @swagger
 * /api/v1/students/{id}/exams:
 *   get:
 *     tags: [Students]
 *     summary: Get student exam history
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
 *         description: Student exam history
 */
router.get(
  '/:id/exams',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  studentController.getStudentExamHistory,
);

/**
 * @swagger
 * /api/v1/students/{id}/suspend:
 *   patch:
 *     tags: [Students]
 *     summary: Suspend student
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
 *         description: Student suspended
 */
router.patch('/:id/suspend', authenticate, authorize('ADMIN'), studentController.suspendStudent);

/**
 * @swagger
 * /api/v1/students/{id}/activate:
 *   patch:
 *     tags: [Students]
 *     summary: Activate student
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
 *         description: Student activated
 */
router.patch('/:id/activate', authenticate, authorize('ADMIN'), studentController.activateStudent);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   delete:
 *     tags: [Students]
 *     summary: Delete student
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
 *         description: Student deleted
 */
router.delete('/:id', authenticate, authorize('ADMIN'), studentController.deleteStudent);

/**
 * @swagger
 * /api/v1/students/profile:
 *   patch:
 *     tags: [Students]
 *     summary: Update own profile (Student only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               bio:
 *                 type: string
 *               gender:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch(
  '/profile',
  authenticate,
  authorize('STUDENT'),
  validate(updateStudentProfileSchema),
  studentController.updateStudentProfile,
);

export default router;
