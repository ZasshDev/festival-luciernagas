import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';
import { z } from 'zod';
import { registerUser, loginUser } from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ data: user });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Email already registered') {
      res.status(400).json({ error: error.message, code: 'BAD_REQUEST' });
      return;
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await loginUser(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24h
      sameSite: 'strict',
    });

    res.status(200).json({ data: user });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      res.status(401).json({ error: error.message, code: 'UNAUTHORIZED' });
      return;
    }
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ data: { message: 'Logged out successfully' } });
};

export const me = (req: Request, res: Response) => {
  res.status(200).json({ data: { user: req.user } });
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, nombre: true, apellidos: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};
