import { Request, Response, NextFunction } from 'express';
import * as authService from './service';
import { sendSuccess } from '@/common/responses/api-response';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    sendSuccess({ res, statusCode: 201, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.verifyEmail(req.body);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess({ res, message: 'Login successful', data: result });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshTokenValue = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshTokenValue) {
      return sendSuccess({ res, statusCode: 401, message: 'No refresh token provided' });
    }

    const result = await authService.refreshToken(refreshTokenValue);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess({ res, message: 'Token refreshed', data: result });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.forgotPassword(req.body);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.resetPassword(req.body);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.changePassword(req.user!.id, req.body);
    sendSuccess({ res, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshTokenValue = req.cookies.refreshToken || req.body.refreshToken;
    await authService.logout(req.user!.id, refreshTokenValue);

    res.clearCookie('refreshToken');
    sendSuccess({ res, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.getProfile(req.user!.id);
    sendSuccess({ res, data: result });
  } catch (error) {
    next(error);
  }
};
