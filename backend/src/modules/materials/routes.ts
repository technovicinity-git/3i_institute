import { Router } from 'express';
import * as materialController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { uploadMaterialSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/materials/course/{courseId}:
 *   get:
 *     tags: [Materials]
 *     summary: Get all materials for a course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: List of materials
 */
router.get('/course/:courseId', authenticate, materialController.getCourseMaterials);

/**
 * @swagger
 * /api/v1/materials/{id}:
 *   get:
 *     tags: [Materials]
 *     summary: Get material by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Material ID
 *     responses:
 *       200:
 *         description: Material details
 *       404:
 *         description: Material not found
 */
router.get('/:id', authenticate, materialController.getMaterialById);

/**
 * @swagger
 * /api/v1/materials:
 *   post:
 *     tags: [Materials]
 *     summary: Upload a new material (Teacher only)
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
 *               - type
 *               - url
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 description: Course ID
 *               title:
 *                 type: string
 *                 description: Material title
 *               description:
 *                 type: string
 *                 description: Material description
 *               type:
 *                 type: string
 *                 enum: [VIDEO, PDF, AUDIO, IMAGE, DOCUMENT]
 *                 description: Material type
 *               url:
 *                 type: string
 *                 description: URL to the material file
 *               duration:
 *                 type: number
 *                 description: Video duration in seconds (for video type)
 *               order:
 *                 type: number
 *                 description: Display order
 *     responses:
 *       201:
 *         description: Material uploaded successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Course not found
 */
router.post(
  '/',
  authenticate,
  authorize('TEACHER'),
  validate(uploadMaterialSchema),
  materialController.uploadMaterial,
);

/**
 * @swagger
 * /api/v1/materials/{id}:
 *   patch:
 *     tags: [Materials]
 *     summary: Update a material (Teacher only, own materials)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Material ID
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
 *               url:
 *                 type: string
 *               duration:
 *                 type: number
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Material updated successfully
 *       403:
 *         description: Not authorized to update this material
 *       404:
 *         description: Material not found
 */
router.patch('/:id', authenticate, authorize('TEACHER'), materialController.updateMaterial);

/**
 * @swagger
 * /api/v1/materials/{id}:
 *   delete:
 *     tags: [Materials]
 *     summary: Delete a material (Teacher only, own materials)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Material ID
 *     responses:
 *       200:
 *         description: Material deleted successfully
 *       403:
 *         description: Not authorized to delete this material
 *       404:
 *         description: Material not found
 */
router.delete('/:id', authenticate, authorize('TEACHER'), materialController.deleteMaterial);

/**
 * @swagger
 * /api/v1/materials/{materialId}/progress:
 *   post:
 *     tags: [Materials]
 *     summary: Update video watch progress
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: string
 *         description: Material ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - position
 *             properties:
 *               position:
 *                 type: number
 *                 description: Last watched position in seconds
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.post('/:materialId/progress', authenticate, materialController.updateVideoProgress);

/**
 * @swagger
 * /api/v1/materials/{materialId}/progress:
 *   get:
 *     tags: [Materials]
 *     summary: Get video watch progress
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: string
 *         description: Material ID
 *     responses:
 *       200:
 *         description: Video progress data
 */
router.get('/:materialId/progress', authenticate, materialController.getVideoProgress);

/**
 * @swagger
 * /api/v1/materials/{materialId}/watched:
 *   post:
 *     tags: [Materials]
 *     summary: Mark video as watched
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         schema:
 *           type: string
 *         description: Material ID
 *     responses:
 *       200:
 *         description: Video marked as watched
 */
router.post('/:materialId/watched', authenticate, materialController.markVideoWatched);

export default router;
