import { Request, Response, NextFunction } from 'express';
import * as batchService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const createBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batch = await batchService.createBatch(req.user!.id, req.body);
    sendSuccess({ res, statusCode: 201, message: 'Batch created', data: batch });
  } catch (error) {
    next(error);
  }
};

export const getBatchesByCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batches = await batchService.getBatchesByCourse(req.params.courseId as string);
    sendSuccess({ res, data: batches });
  } catch (error) {
    next(error);
  }
};

export const getBatchById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batch = await batchService.getBatchById(req.params.id as string);
    sendSuccess({ res, data: batch });
  } catch (error) {
    next(error);
  }
};

export const updateBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batch = await batchService.updateBatch(req.params.id as string, req.user!.id, req.body);
    sendSuccess({ res, message: 'Batch updated', data: batch });
  } catch (error) {
    next(error);
  }
};

export const closeBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await batchService.closeBatch(req.params.id as string, req.user!.id);
    sendSuccess({ res, message: result.message, data: result.batch });
  } catch (error) {
    next(error);
  }
};

export const reopenBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await batchService.reopenBatch(req.params.id as string, req.user!.id);
    sendSuccess({ res, message: result.message, data: result.batch });
  } catch (error) {
    next(error);
  }
};

export const deleteBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await batchService.deleteBatch(req.params.id as string, req.user!.id);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const addSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await batchService.addSession(
      req.params.batchId as string,
      req.user!.id,
      req.body,
    );
    sendSuccess({ res, statusCode: 201, message: 'Session added', data: session });
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await batchService.updateSession(
      req.params.sessionId as string,
      req.user!.id,
      req.body,
    );
    sendSuccess({ res, message: 'Session updated', data: session });
  } catch (error) {
    next(error);
  }
};

export const deleteSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await batchService.deleteSession(req.params.sessionId as string, req.user!.id);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const joinBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await batchService.joinBatch(req.params.id as string, req.user!.id);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const leaveBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await batchService.leaveBatch(req.params.id as string, req.user!.id);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};
