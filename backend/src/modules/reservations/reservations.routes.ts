import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { authGuard } from '../../middlewares/authGuard';
import { roleGuard } from '../../middlewares/roleGuard';
import { createReservationSchema } from './reservations.schemas';
import {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  validateReservation,
} from './reservations.controller';

const router = Router();

// Client routes
router.post('/', authGuard, roleGuard('CLIENT'), validate(createReservationSchema), createReservation);
router.get('/me', authGuard, roleGuard('CLIENT'), getMyReservations);
router.delete('/:id', authGuard, roleGuard('CLIENT'), cancelReservation);

// Admin routes
router.get('/', authGuard, roleGuard('ADMIN'), getAllReservations);
router.post('/validate', authGuard, roleGuard('ADMIN'), validateReservation);

export default router;
