import { Request, Response, NextFunction } from 'express';
import * as chatService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await chatService.sendMessage(req.user!.id, req.body);
    sendSuccess({ res, statusCode: 201, message: 'Message sent', data: message });
  } catch (error) {
    next(error);
  }
};

export const getCourseMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await chatService.getCourseMessages(
      req.params.courseId as string,
      req.user!.id,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 50,
    );
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await chatService.deleteMessage(req.params.messageId as string, req.user!.id);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};
