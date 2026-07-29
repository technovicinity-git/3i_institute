import { Router } from 'express';
import * as topicController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { createTopicSchema, updateTopicSchema } from './validation';

const router: Router = Router();

router.get('/', authenticate, topicController.getTopics);
router.get('/:id', authenticate, topicController.getTopicById);
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createTopicSchema),
  topicController.createTopic,
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateTopicSchema),
  topicController.updateTopic,
);
router.delete('/:id', authenticate, authorize('ADMIN'), topicController.deleteTopic);
router.patch(
  '/:id/toggle-status',
  authenticate,
  authorize('ADMIN'),
  topicController.toggleTopicStatus,
);

export default router;
