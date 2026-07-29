import { Request, Response, NextFunction } from 'express';
import * as studentService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await studentService.getStudents(req.query);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await studentService.getStudentById(req.params.id as string);
    sendSuccess({ res, data: student });
  } catch (error) {
    next(error);
  }
};

export const getStudentEnrollments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const enrollments = await studentService.getStudentEnrollments(req.params.id as string);
    sendSuccess({ res, data: enrollments });
  } catch (error) {
    next(error);
  }
};

export const getStudentExamHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exams = await studentService.getStudentExamHistory(req.params.id as string);
    sendSuccess({ res, data: exams });
  } catch (error) {
    next(error);
  }
};

export const suspendStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await studentService.suspendStudent(req.params.id as string);
    sendSuccess({ res, message: result.message, data: result.student });
  } catch (error) {
    next(error);
  }
};

export const activateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await studentService.activateStudent(req.params.id as string);
    sendSuccess({ res, message: result.message, data: result.student });
  } catch (error) {
    next(error);
  }
};

export const updateStudentProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await studentService.updateStudentProfile(req.user!.id, req.body);
    sendSuccess({ res, message: 'Profile updated successfully', data: profile });
  } catch (error) {
    next(error);
  }
};

export const getStudentStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await studentService.getStudentStats();
    sendSuccess({ res, data: stats });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await studentService.deleteStudent(req.params.id as string);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};
