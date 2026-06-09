import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';
import { z } from 'zod';
import { registerSchema, loginSchema } from './auth.schemas';

type RegisterInput = z.infer<typeof registerSchema>['body'];
type LoginInput = z.infer<typeof loginSchema>['body'];

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      password: hashedPassword,
    },
  });

  return { id: user.id, email: user.email, role: user.role };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const secret = process.env.JWT_SECRET || 'secret';
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    secret,
    { expiresIn: '24h' }
  );

  return {
    user: { id: user.id, email: user.email, role: user.role, nombre: user.nombre },
    token,
  };
};
