import { Router } from 'express';
import * as certificateController from './controller';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/certificates/mine:
 *   get:
 *     tags: [Certificates]
 *     summary: Get my certificates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certificates
 */
router.get('/mine', authenticate, certificateController.getMyCertificates);

/**
 * @swagger
 * /api/v1/certificates/{id}:
 *   get:
 *     tags: [Certificates]
 *     summary: Get certificate by ID
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
 *         description: Certificate details
 */
router.get('/:id', authenticate, certificateController.getCertificateById);

/**
 * @swagger
 * /api/v1/certificates/attendance/{courseId}:
 *   post:
 *     tags: [Certificates]
 *     summary: Generate attendance certificate
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Certificate generated
 */
router.post('/attendance/:courseId', authenticate, certificateController.getAttendanceCertificate);

/**
 * @swagger
 * /api/v1/certificates/completion/{courseId}:
 *   post:
 *     tags: [Certificates]
 *     summary: Generate completion certificate
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Certificate generated
 */
router.post('/completion/:courseId', authenticate, certificateController.getCompletionCertificate);

/**
 * @swagger
 * /api/v1/certificates/student/{studentId}:
 *   get:
 *     tags: [Certificates]
 *     summary: Get student certificates (Admin/Teacher)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student certificates
 */
router.get(
  '/student/:studentId',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  certificateController.getStudentCertificates,
);

export default router;
