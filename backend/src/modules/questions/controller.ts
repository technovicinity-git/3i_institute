import { Request, Response, NextFunction } from 'express';
import * as questionService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const createMCQ = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await questionService.createMCQ(req.user!.id, req.body);
    sendSuccess({ res, statusCode: 201, message: 'MCQ created', data: question });
  } catch (error) {
    next(error);
  }
};

export const createShortQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await questionService.createShortQuestion(req.user!.id, req.body);
    sendSuccess({ res, statusCode: 201, message: 'Question created', data: question });
  } catch (error) {
    next(error);
  }
};

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await questionService.getQuestions(req.user!.id, req.user!.role, req.query);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await questionService.getQuestionById(req.params.id as string);
    sendSuccess({ res, data: question });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = await questionService.updateQuestion(
      req.params.id as string,
      req.user!.id,
      req.body,
    );
    sendSuccess({ res, message: 'Question updated', data: question });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await questionService.deleteQuestion(req.params.id as string, req.user!.id);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};
