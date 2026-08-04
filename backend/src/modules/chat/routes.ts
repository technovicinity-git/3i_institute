import { Router } from 'express';
import * as chatController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { sendMessageSchema } from './validation';

const router: Router = Router();

/**
 * @swagger
 * /api/v1/chat/course/{courseId}:
 *   get:
 *     tags: [Chat]
 *     summary: Get course messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
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
 *         description: Course messages
 */
router.get('/course/:courseId', authenticate, chatController.getCourseMessages);

/**
 * @swagger
 * /api/v1/chat/send:
 *   post:
 *     tags: [Chat]
 *     summary: Send a message
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
 *               - message
 *             properties:
 *               courseId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post('/send', authenticate, validate(sendMessageSchema), chatController.sendMessage);

/**
 * @swagger
 * /api/v1/chat/message/{messageId}:
 *   delete:
 *     tags: [Chat]
 *     summary: Delete a message
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted
 */
router.delete('/message/:messageId', authenticate, chatController.deleteMessage);

export default router;
