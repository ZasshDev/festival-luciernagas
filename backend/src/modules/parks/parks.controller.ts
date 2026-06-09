import { Request, Response, NextFunction } from 'express';
import { parksService } from './parks.service';

export const getAllParks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parks = await parksService.getAllParks();
    res.status(200).json({ data: parks });
  } catch (error) {
    next(error);
  }
};

export const getParkById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const park = await parksService.getParkById(req.params.id);
    res.status(200).json({ data: park });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Park not found') {
      res.status(404).json({ error: error.message, code: 'NOT_FOUND' });
      return;
    }
    next(error);
  }
};

export const createPark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const park = await parksService.createPark(req.body);
    res.status(201).json({ data: park });
  } catch (error) {
    next(error);
  }
};

export const updatePark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const park = await parksService.updatePark(req.params.id, req.body);
    res.status(200).json({ data: park });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Park not found') {
      res.status(404).json({ error: error.message, code: 'NOT_FOUND' });
      return;
    }
    next(error);
  }
};

export const deletePark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await parksService.deletePark(req.params.id);
    res.status(200).json({ data: { message: 'Park deleted successfully' } });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Park not found') {
      res.status(404).json({ error: error.message, code: 'NOT_FOUND' });
      return;
    }
    next(error);
  }
};
