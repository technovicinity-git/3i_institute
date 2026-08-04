import { Request, Response, NextFunction } from 'express';
import * as noteService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.createNote(req.user!.id, req.body);
    sendSuccess({ res, statusCode: 201, message: 'Note created', data: note });
  } catch (error) {
    next(error);
  }
};

export const getNotesByCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await noteService.getNotesByCourse(req.user!.id, req.params.courseId as string);
    sendSuccess({ res, data: notes });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.getNoteById(req.user!.id, req.params.id as string);
    sendSuccess({ res, data: note });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.updateNote(req.user!.id, req.params.id as string, req.body);
    sendSuccess({ res, message: 'Note updated', data: note });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await noteService.deleteNote(req.user!.id, req.params.id as string);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};
