import { Router } from 'express';
import * as subjectController from './controller';
import { validate } from '@/common/middleware/validate';
import { authenticate } from '@/common/middleware/auth';
import { authorize } from '@/common/middleware/role';
import { createSubjectSchema, updateSubjectSchema } from './validation';

const router: Router = Router();

router.get('/', authenticate, subjectController.getSubjects);
router.get('/:id', authenticate, subjectController.getSubjectById);
router.get('/topic/:topicId', authenticate, subjectController.getSubjectsByTopic);
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createSubjectSchema),
  subjectController.createSubject,
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateSubjectSchema),
  subjectController.updateSubject,
);
router.delete('/:id', authenticate, authorize('ADMIN'), subjectController.deleteSubject);
router.patch(
  '/:id/toggle-status',
  authenticate,
  authorize('ADMIN'),
  subjectController.toggleSubjectStatus,
);

export default router;
