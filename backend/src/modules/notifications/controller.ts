import { Request, Response, NextFunction } from 'express';
import * as notificationService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.getMyNotifications(
      req.user!.id,
      Number(req.query.page) || 1,
      Number(req.query.limit) || 20,
    );
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAsRead(req.params.id as string, req.user!.id);
    sendSuccess({ res, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.markAllAsRead(req.user!.id);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};
