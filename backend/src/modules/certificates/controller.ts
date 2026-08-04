import { Request, Response, NextFunction } from 'express';
import * as certificateService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const getMyCertificates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certificates = await certificateService.getMyCertificates(req.user!.id);
    sendSuccess({ res, data: certificates });
  } catch (error) {
    next(error);
  }
};

export const getCertificateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certificate = await certificateService.getCertificateById(
      req.params.id as string,
      req.user!.id,
    );
    sendSuccess({ res, data: certificate });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certificate = await certificateService.getAttendanceCertificate(
      req.user!.id,
      req.params.courseId as string,
    );
    sendSuccess({
      res,
      statusCode: 201,
      message: 'Attendance certificate generated',
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompletionCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certificate = await certificateService.getCompletionCertificate(
      req.user!.id,
      req.params.courseId as string,
    );
    sendSuccess({
      res,
      statusCode: 201,
      message: 'Completion certificate generated',
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentCertificates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certificates = await certificateService.getStudentCertificates(
      req.params.studentId as string,
    );
    sendSuccess({ res, data: certificates });
  } catch (error) {
    next(error);
  }
};
