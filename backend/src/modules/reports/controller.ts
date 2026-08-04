import { Request, Response, NextFunction } from 'express';
import * as reportService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await reportService.getDashboardStats();
    sendSuccess({ res, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getRevenueReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await reportService.getRevenueReport(
      req.query.from as string,
      req.query.to as string,
    );
    sendSuccess({ res, data: report });
  } catch (error) {
    next(error);
  }
};

export const getCoursePopularityReport = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const report = await reportService.getCoursePopularityReport();
    sendSuccess({ res, data: report });
  } catch (error) {
    next(error);
  }
};

export const getStudentGrowthReport = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await reportService.getStudentGrowthReport();
    sendSuccess({ res, data: report });
  } catch (error) {
    next(error);
  }
};

export const getTeacherStatsReport = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await reportService.getTeacherStatsReport();
    sendSuccess({ res, data: report });
  } catch (error) {
    next(error);
  }
};

export const getExamStatsReport = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await reportService.getExamStatsReport();
    sendSuccess({ res, data: report });
  } catch (error) {
    next(error);
  }
};
