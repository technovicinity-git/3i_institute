import { Request, Response, NextFunction } from 'express';
import * as materialService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const uploadMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await materialService.uploadMaterial(req.user!.id, req.body);
    sendSuccess({ res, statusCode: 201, message: 'Material uploaded', data: material });
  } catch (error) {
    next(error);
  }
};

export const getCourseMaterials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materials = await materialService.getCourseMaterials(req.params.courseId as string);
    sendSuccess({ res, data: materials });
  } catch (error) {
    next(error);
  }
};

export const getMaterialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await materialService.getMaterialById(req.params.id as string);
    sendSuccess({ res, data: material });
  } catch (error) {
    next(error);
  }
};

export const updateMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const material = await materialService.updateMaterial(
      req.params.id as string,
      req.user!.id,
      req.body,
    );
    sendSuccess({ res, message: 'Material updated', data: material });
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await materialService.deleteMaterial(req.params.id as string, req.user!.id);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const updateVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await materialService.updateVideoProgress(
      req.user!.id,
      req.params.materialId as string,
      req.body.position,
    );
    sendSuccess({ res, data: progress });
  } catch (error) {
    next(error);
  }
};

export const getVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await materialService.getVideoProgress(
      req.user!.id,
      req.params.materialId as string,
    );
    sendSuccess({ res, data: progress });
  } catch (error) {
    next(error);
  }
};

export const markVideoWatched = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await materialService.markVideoWatched(
      req.user!.id,
      req.params.materialId as string,
    );
    sendSuccess({ res, message: 'Video marked as watched', data: progress });
  } catch (error) {
    next(error);
  }
};
