import { Router } from 'express';
import * as courseController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { createCourseSchema, updateCourseSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/courses/published:
 *   get:
 *     tags: [Courses]
 *     summary: Get all published courses (Public)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [REGULAR, ONLINE, MIXED]
 *       - in: query
 *         name: topicId
 *         schema:
 *           type: string
 *       - in: query
 *         name: subjectId
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
 *         description: List of published courses
 */
router.get('/published', courseController.getPublishedCourses);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     tags: [Courses]
 *     summary: Get course by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 */
router.get('/:id', courseController.getCourseById);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     tags: [Courses]
 *     summary: Get all courses (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [REGULAR, ONLINE, MIXED]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, SUSPENDED]
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
 *         description: List of all courses
 */
router.get('/', authenticate, authorize('ADMIN'), courseController.getCourses);

/**
 * @swagger
 * /api/v1/courses/teacher/mine:
 *   get:
 *     tags: [Courses]
 *     summary: Get teacher's own courses
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
 *           enum: [DRAFT, PUBLISHED, SUSPENDED]
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
 *         description: Teacher's courses
 */
router.get('/teacher/mine', authenticate, authorize('TEACHER'), courseController.getTeacherCourses);

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     tags: [Courses]
 *     summary: Create a course (Teacher only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               topicId:
 *                 type: string
 *                 format: uuid
 *               subjectId:
 *                 type: string
 *                 format: uuid
 *               type:
 *                 type: string
 *                 enum: [REGULAR, ONLINE, MIXED]
 *     responses:
 *       201:
 *         description: Course created
 */
router.post(
  '/',
  authenticate,
  authorize('TEACHER'),
  validate(createCourseSchema),
  courseController.createCourse,
);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   patch:
 *     tags: [Courses]
 *     summary: Update a course (Teacher only, own courses)
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
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               topicId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [REGULAR, ONLINE, MIXED]
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, SUSPENDED]
 *     responses:
 *       200:
 *         description: Course updated
 */
router.patch(
  '/:id',
  authenticate,
  authorize('TEACHER'),
  validate(updateCourseSchema),
  courseController.updateCourse,
);

/**
 * @swagger
 * /api/v1/courses/{id}/publish:
 *   patch:
 *     tags: [Courses]
 *     summary: Publish a course (Teacher only, own courses)
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
 *         description: Course published
 */
router.patch('/:id/publish', authenticate, authorize('TEACHER'), courseController.publishCourse);

/**
 * @swagger
 * /api/v1/courses/{id}/suspend:
 *   patch:
 *     tags: [Courses]
 *     summary: Suspend a course (Teacher only, own courses)
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
 *         description: Course suspended
 */
router.patch('/:id/suspend', authenticate, authorize('TEACHER'), courseController.suspendCourse);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     tags: [Courses]
 *     summary: Delete a course (Teacher only, own courses)
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
 *         description: Course deleted
 */
router.delete('/:id', authenticate, authorize('TEACHER'), courseController.deleteCourse);

export default router;
