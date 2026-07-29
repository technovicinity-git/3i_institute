import { Request, Response, NextFunction } from 'express';
import * as teacherService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teacherService.getTeachers(req.query as any);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const getTeacherById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id as string);
    sendSuccess({ res, data: teacher });
  } catch (error) {
    next(error);
  }
};

export const getPendingTeachers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teacherService.getPendingTeachers(req.query as any);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const approveTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { approved, reason } = req.body;
    const result = await teacherService.approveTeacher(req.params.id as string, approved, reason);
    sendSuccess({ res, message: result.message, data: result.teacher });
  } catch (error) {
    next(error);
  }
};

export const suspendTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teacherService.suspendTeacher(req.params.id as string);
    sendSuccess({ res, message: result.message, data: result.teacher });
  } catch (error) {
    next(error);
  }
};

export const activateTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teacherService.activateTeacher(req.params.id as string);
    sendSuccess({ res, message: result.message, data: result.teacher });
  } catch (error) {
    next(error);
  }
};

export const updateTeacherProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await teacherService.updateTeacherProfile(req.user!.id, req.body);
    sendSuccess({ res, message: 'Profile updated successfully', data: profile });
  } catch (error) {
    next(error);
  }
};

export const getTeacherStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await teacherService.getTeacherStats();
    sendSuccess({ res, data: stats });
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teacherService.deleteTeacher(req.params.id as string);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};
