import { Request, Response, NextFunction } from 'express';
import * as enrollmentService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await enrollmentService.subscribeToPlatform(req.user!.id);
    sendSuccess({ res, statusCode: 201, message: result.message, data: result.subscription });
  } catch (error) {
    next(error);
  }
};

export const checkSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await enrollmentService.checkSubscription(req.user!.id);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const enrollCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await enrollmentService.enrollCourse(req.user!.id, req.body.courseId);
    sendSuccess({ res, statusCode: 201, message: result.message, data: result.enrollment });
  } catch (error) {
    next(error);
  }
};

export const getMyEnrollments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const enrollments = await enrollmentService.getMyEnrollments(req.user!.id);
    sendSuccess({ res, data: enrollments });
  } catch (error) {
    next(error);
  }
};

export const unenrollCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await enrollmentService.unenrollCourse(
      req.user!.id,
      req.params.courseId as string,
    );
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const getEnrollmentStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await enrollmentService.getEnrollmentStats();
    sendSuccess({ res, data: stats });
  } catch (error) {
    next(error);
  }
};
