import { Router } from 'express';
import * as enrollmentController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { enrollCourseSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/enrollments/subscribe:
 *   post:
 *     tags: [Enrollments]
 *     summary: Subscribe to platform (Student only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Subscribed successfully
 */
router.post('/subscribe', authenticate, authorize('STUDENT'), enrollmentController.subscribe);

/**
 * @swagger
 * /api/v1/enrollments/subscription:
 *   get:
 *     tags: [Enrollments]
 *     summary: Check subscription status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status
 */
router.get('/subscription', authenticate, enrollmentController.checkSubscription);

/**
 * @swagger
 * /api/v1/enrollments/enroll:
 *   post:
 *     tags: [Enrollments]
 *     summary: Enroll in a course (Student only)
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
 *         description: Enrolled successfully
 */
router.post(
  '/enroll',
  authenticate,
  authorize('STUDENT'),
  validate(enrollCourseSchema),
  enrollmentController.enrollCourse,
);

/**
 * @swagger
 * /api/v1/enrollments/mine:
 *   get:
 *     tags: [Enrollments]
 *     summary: Get my enrollments (Student only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get('/mine', authenticate, authorize('STUDENT'), enrollmentController.getMyEnrollments);

/**
 * @swagger
 * /api/v1/enrollments/unenroll/{courseId}:
 *   delete:
 *     tags: [Enrollments]
 *     summary: Unenroll from a course (Student only)
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
 *         description: Unenrolled successfully
 */
router.delete(
  '/unenroll/:courseId',
  authenticate,
  authorize('STUDENT'),
  enrollmentController.unenrollCourse,
);

/**
 * @swagger
 * /api/v1/enrollments/stats:
 *   get:
 *     tags: [Enrollments]
 *     summary: Get enrollment statistics (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrollment statistics
 */
router.get('/stats', authenticate, authorize('ADMIN'), enrollmentController.getEnrollmentStats);

export default router;
