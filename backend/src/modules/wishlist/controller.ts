import { Request, Response, NextFunction } from 'express';
import * as wishlistService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await wishlistService.addToWishlist(req.user!.id, req.body.courseId);
    sendSuccess({ res, statusCode: 201, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await wishlistService.removeFromWishlist(
      req.user!.id,
      req.params.courseId as string,
    );
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user!.id);
    sendSuccess({ res, data: wishlist });
  } catch (error) {
    next(error);
  }
};
