import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';

export class ReservationsRepository {
  async findAll() {
    return prisma.reservation.findMany({
      include: {
        user: { select: { nombre: true, apellidos: true, email: true } },
        park: { select: { nombre: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId: string) {
    return prisma.reservation.findMany({
      where: { userId },
      include: {
        park: { select: { nombre: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdAndUserId(id: string, userId: string) {
    return prisma.reservation.findFirst({
      where: { id, userId },
    });
  }

  async create(data: Prisma.ReservationUncheckedCreateInput) {
    return prisma.reservation.create({
      data,
      include: {
        user: { select: { email: true } },
        park: { select: { nombre: true } },
      },
    });
  }

  async updateStatus(id: string, status: 'CANCELLED') {
    return prisma.reservation.update({
      where: { id },
      data: { status },
    });
  }
}

export const reservationsRepository = new ReservationsRepository();
