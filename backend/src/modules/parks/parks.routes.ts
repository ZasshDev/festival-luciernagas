import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { authGuard } from '../../middlewares/authGuard';
import { roleGuard } from '../../middlewares/roleGuard';
import { createParkSchema, updateParkSchema } from './parks.schemas';
import {
  getAllParks,
  getParkById,
  createPark,
  updatePark,
  deletePark,
} from './parks.controller';

const router = Router();

// Public routes
router.get('/', getAllParks);
router.get('/:id', getParkById);

// Admin only routes
router.post('/', authGuard, roleGuard('ADMIN'), validate(createParkSchema), createPark);
router.put('/:id', authGuard, roleGuard('ADMIN'), validate(updateParkSchema), updatePark);
router.delete('/:id', authGuard, roleGuard('ADMIN'), deletePark);

export default router;
