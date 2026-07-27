import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@/common/errors';
import { Role } from '@/common/constants';

export const authorize = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }

    if (!roles.includes(req.user.role as Role)) {
      throw new UnauthorizedError('Insufficient permissions');
    }

    next();
  };
};
