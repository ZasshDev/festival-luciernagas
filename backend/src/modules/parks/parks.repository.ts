import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';

export class ParksRepository {
  async findAll() {
    return prisma.park.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.park.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.ParkCreateInput) {
    return prisma.park.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ParkUpdateInput) {
    return prisma.park.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.park.delete({
      where: { id },
    });
  }
}

export const parksRepository = new ParksRepository();
