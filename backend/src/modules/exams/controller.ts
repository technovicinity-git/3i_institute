import { Request, Response, NextFunction } from 'express';
import * as examService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const createExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exam = await examService.createExam(req.user!.id, req.body);
    sendSuccess({ res, statusCode: 201, message: 'Exam created', data: exam });
  } catch (error) {
    next(error);
  }
};

export const getCourseExams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exams = await examService.getCourseExams(req.params.courseId as string);
    sendSuccess({ res, data: exams });
  } catch (error) {
    next(error);
  }
};

export const getExamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exam = await examService.getExamById(req.params.id as string);
    sendSuccess({ res, data: exam });
  } catch (error) {
    next(error);
  }
};

export const getExamForStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exam = await examService.getExamForStudent(req.params.id as string, req.user!.id);
    sendSuccess({ res, data: exam });
  } catch (error) {
    next(error);
  }
};

export const submitExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await examService.submitExam(req.user!.id, req.body);
    sendSuccess({ res, statusCode: 201, message: result.message, data: result });
  } catch (error) {
    next(error);
  }
};

export const getStudentExams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exams = await examService.getStudentExams(req.user!.id);
    sendSuccess({ res, data: exams });
  } catch (error) {
    next(error);
  }
};

export const getExamResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await examService.getExamResults(req.params.id as string, req.user!.id);
    sendSuccess({ res, data: results });
  } catch (error) {
    next(error);
  }
};

export const reviewAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await examService.reviewAnswer(
      req.params.studentExamId as string,
      req.params.questionId as string,
      req.user!.id,
      req.body.marks,
    );
    sendSuccess({ res, message: result.message, data: result.exam });
  } catch (error) {
    next(error);
  }
};

export const deleteExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await examService.deleteExam(req.params.id as string, req.user!.id);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};
