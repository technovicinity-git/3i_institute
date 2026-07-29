import { Router } from 'express';
import * as teacherController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import {
  teacherFiltersSchema,
  approveTeacherSchema,
  updateTeacherProfileSchema,
} from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/teachers/stats:
 *   get:
 *     tags: [Teachers]
 *     summary: Get teacher statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher statistics
 */
router.get('/stats', authenticate, authorize('ADMIN'), teacherController.getTeacherStats);

/**
 * @swagger
 * /api/v1/teachers/pending:
 *   get:
 *     tags: [Teachers]
 *     summary: Get pending teacher approvals
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of pending teachers
 */
router.get('/pending', authenticate, authorize('ADMIN'), teacherController.getPendingTeachers);

/**
 * @swagger
 * /api/v1/teachers:
 *   get:
 *     tags: [Teachers]
 *     summary: Get all teachers
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
 *           enum: [PENDING, ACTIVE, SUSPENDED, REJECTED]
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
 *         description: List of teachers
 */
router.get('/', authenticate, authorize('ADMIN'), teacherController.getTeachers);

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   get:
 *     tags: [Teachers]
 *     summary: Get teacher by ID
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
 *         description: Teacher details
 */
router.get('/:id', authenticate, authorize('ADMIN'), teacherController.getTeacherById);

/**
 * @swagger
 * /api/v1/teachers/{id}/approve:
 *   patch:
 *     tags: [Teachers]
 *     summary: Approve or reject teacher
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
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher approved/rejected
 */
router.patch(
  '/:id/approve',
  authenticate,
  authorize('ADMIN'),
  validate(approveTeacherSchema),
  teacherController.approveTeacher,
);

/**
 * @swagger
 * /api/v1/teachers/{id}/suspend:
 *   patch:
 *     tags: [Teachers]
 *     summary: Suspend teacher
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
 *         description: Teacher suspended
 */
router.patch('/:id/suspend', authenticate, authorize('ADMIN'), teacherController.suspendTeacher);

/**
 * @swagger
 * /api/v1/teachers/{id}/activate:
 *   patch:
 *     tags: [Teachers]
 *     summary: Activate teacher
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
 *         description: Teacher activated
 */
router.patch('/:id/activate', authenticate, authorize('ADMIN'), teacherController.activateTeacher);

/**
 * @swagger
 * /api/v1/teachers/{id}:
 *   delete:
 *     tags: [Teachers]
 *     summary: Delete teacher
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
 *         description: Teacher deleted
 */
router.delete('/:id', authenticate, authorize('ADMIN'), teacherController.deleteTeacher);

/**
 * @swagger
 * /api/v1/teachers/profile:
 *   patch:
 *     tags: [Teachers]
 *     summary: Update own profile (Teacher only)
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
 *               academicInfo:
 *                 type: string
 *               professionalExperience:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch(
  '/profile',
  authenticate,
  authorize('TEACHER'),
  validate(updateTeacherProfileSchema),
  teacherController.updateTeacherProfile,
);

export default router;
