import { Request, Response, NextFunction } from 'express';
import * as courseService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await courseService.createCourse(req.user!.id, req.body);
    sendSuccess({ res, statusCode: 201, message: 'Course created', data: course });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await courseService.getCourses(req.query);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const getTeacherCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await courseService.getTeacherCourses(req.user!.id, req.query);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const getPublishedCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await courseService.getPublishedCourses(req.query);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await courseService.getCourseById(req.params.id as string);
    sendSuccess({ res, data: course });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await courseService.updateCourse(
      req.params.id as string,
      req.user!.id,
      req.body,
    );
    sendSuccess({ res, message: 'Course updated', data: course });
  } catch (error) {
    next(error);
  }
};

export const publishCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await courseService.updateCourseStatus(
      req.params.id as string,
      req.user!.id,
      'PUBLISHED',
    );
    sendSuccess({ res, message: result.message, data: result.course });
  } catch (error) {
    next(error);
  }
};

export const suspendCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await courseService.updateCourseStatus(
      req.params.id as string,
      req.user!.id,
      'SUSPENDED',
    );
    sendSuccess({ res, message: result.message, data: result.course });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await courseService.deleteCourse(req.params.id as string, req.user!.id);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};
