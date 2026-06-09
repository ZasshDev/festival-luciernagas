import { Request, Response, NextFunction } from 'express';

export const roleGuard = (requiredRole: 'CLIENT' | 'ADMIN') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' });
      return;
    }

    if (req.user.role !== requiredRole) {
      res.status(403).json({ error: 'Insufficient permissions', code: 'FORBIDDEN' });
      return;
    }

    next();
  };
};
