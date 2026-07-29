import { Request, Response, NextFunction } from 'express';
import * as subjectService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await subjectService.createSubject(req.body);
    sendSuccess({ res, statusCode: 201, message: 'Subject created', data: subject });
  } catch (error) {
    next(error);
  }
};

export const getSubjects = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const subjects = await subjectService.getSubjects();
    sendSuccess({ res, data: subjects });
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await subjectService.getSubjectById(req.params.id as string);
    sendSuccess({ res, data: subject });
  } catch (error) {
    next(error);
  }
};

export const getSubjectsByTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subjects = await subjectService.getSubjectsByTopic(req.params.topicId as string);
    sendSuccess({ res, data: subjects });
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await subjectService.updateSubject(req.params.id as string, req.body);
    sendSuccess({ res, message: 'Subject updated', data: subject });
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await subjectService.deleteSubject(req.params.id as string);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const toggleSubjectStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await subjectService.toggleSubjectStatus(req.params.id as string);
    sendSuccess({ res, message: result.message, data: result.subject });
  } catch (error) {
    next(error);
  }
};
