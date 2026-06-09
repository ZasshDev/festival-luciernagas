import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export interface AuthPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ error: 'Authentication required', code: 'UNAUTHORIZED' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret) as AuthPayload;

    // Verify user actually exists in the database
    prisma.user.findUnique({ where: { id: decoded.userId } })
      .then(user => {
        if (!user) {
          res.clearCookie('token');
          res.status(401).json({ error: 'User no longer exists', code: 'UNAUTHORIZED' });
          return;
        }
        req.user = { userId: user.id, role: user.role };
        next();
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
      });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' });
  }
};
