import { Request, Response, NextFunction } from 'express';
import * as waiverService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const createWaiverRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const waiver = await waiverService.createWaiverRequest(req.user!.id, req.body);
    sendSuccess({ res, statusCode: 201, message: 'Waiver request submitted', data: waiver });
  } catch (error) {
    next(error);
  }
};

export const getWaiverRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await waiverService.getWaiverRequests(req.query);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMyWaiverRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await waiverService.getMyWaiverRequests(req.user!.id);
    sendSuccess({ res, data: requests });
  } catch (error) {
    next(error);
  }
};

export const processWaiverRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await waiverService.processWaiverRequest(req.params.id as string, req.body);
    sendSuccess({ res, message: result.message, data: result.waiver });
  } catch (error) {
    next(error);
  }
};
