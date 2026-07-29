import { Request, Response, NextFunction } from 'express';
import * as topicService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const createTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topic = await topicService.createTopic(req.body);
    sendSuccess({ res, statusCode: 201, message: 'Topic created', data: topic });
  } catch (error) {
    next(error);
  }
};

export const getTopics = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const topics = await topicService.getTopics();
    sendSuccess({ res, data: topics });
  } catch (error) {
    next(error);
  }
};

export const getTopicById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topic = await topicService.getTopicById(req.params.id as string);
    sendSuccess({ res, data: topic });
  } catch (error) {
    next(error);
  }
};

export const updateTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topic = await topicService.updateTopic(req.params.id as string, req.body);
    sendSuccess({ res, message: 'Topic updated', data: topic });
  } catch (error) {
    next(error);
  }
};

export const deleteTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await topicService.deleteTopic(req.params.id as string);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const toggleTopicStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await topicService.toggleTopicStatus(req.params.id as string);
    sendSuccess({ res, message: result.message, data: result.topic });
  } catch (error) {
    next(error);
  }
};
