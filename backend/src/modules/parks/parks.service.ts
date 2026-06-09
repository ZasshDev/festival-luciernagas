import { parksRepository } from './parks.repository';
import { Prisma } from '@prisma/client';

export class ParksService {
  async getAllParks() {
    return parksRepository.findAll();
  }

  async getParkById(id: string) {
    const park = await parksRepository.findById(id);
    if (!park) {
      throw new Error('Park not found');
    }
    return park;
  }

  async createPark(data: Prisma.ParkCreateInput) {
    return parksRepository.create(data);
  }

  async updatePark(id: string, data: Prisma.ParkUpdateInput) {
    await this.getParkById(id); // Check existence
    return parksRepository.update(id, data);
  }

  async deletePark(id: string) {
    await this.getParkById(id); // Check existence
    return parksRepository.delete(id);
  }
}

export const parksService = new ParksService();
