import { Router } from 'express';
import * as reportController from './controller';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/reports/dashboard:
 *   get:
 *     tags: [Reports]
 *     summary: Get dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get('/dashboard', authenticate, authorize('ADMIN'), reportController.getDashboardStats);

/**
 * @swagger
 * /api/v1/reports/revenue:
 *   get:
 *     tags: [Reports]
 *     summary: Get revenue report
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Revenue report
 */
router.get('/revenue', authenticate, authorize('ADMIN'), reportController.getRevenueReport);

/**
 * @swagger
 * /api/v1/reports/courses:
 *   get:
 *     tags: [Reports]
 *     summary: Get course popularity report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course popularity
 */
router.get(
  '/courses',
  authenticate,
  authorize('ADMIN'),
  reportController.getCoursePopularityReport,
);

/**
 * @swagger
 * /api/v1/reports/students:
 *   get:
 *     tags: [Reports]
 *     summary: Get student growth report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student growth
 */
router.get('/students', authenticate, authorize('ADMIN'), reportController.getStudentGrowthReport);

/**
 * @swagger
 * /api/v1/reports/teachers:
 *   get:
 *     tags: [Reports]
 *     summary: Get teacher statistics report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher stats
 */
router.get('/teachers', authenticate, authorize('ADMIN'), reportController.getTeacherStatsReport);

/**
 * @swagger
 * /api/v1/reports/exams:
 *   get:
 *     tags: [Reports]
 *     summary: Get exam statistics report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Exam stats
 */
router.get('/exams', authenticate, authorize('ADMIN'), reportController.getExamStatsReport);

export default router;
