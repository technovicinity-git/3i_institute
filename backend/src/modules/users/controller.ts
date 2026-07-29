import { Request, Response, NextFunction } from 'express';
import * as userService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    sendSuccess({ res, statusCode: 201, message: 'User created successfully', data: user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getUsers(req.query as any);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id as string);
    sendSuccess({ res, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUser(req.params.id as string, req.body);
    sendSuccess({ res, message: 'User updated successfully', data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.deleteUser(req.params.id as string);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const user = await userService.updateUserStatus(req.params.id as string, status);
    sendSuccess({ res, message: `User ${status.toLowerCase()} successfully`, data: user });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await userService.getUserStats();
    sendSuccess({ res, data: stats });
  } catch (error) {
    next(error);
  }
};
