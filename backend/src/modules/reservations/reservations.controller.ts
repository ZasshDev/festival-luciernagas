import { Request, Response, NextFunction } from 'express';
import { reservationsRepository } from './reservations.repository';
import { isWithinFestivalPeriod, containsMaintenanceDay, checkAvailability } from './availability.service';
import { sendConfirmationEmail, sendCancellationEmail } from '../../services/email.service';
import prisma from '../../lib/prisma';

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { parkId, fechaInicio, fechaFin, numPersonas, tipo } = req.body;
    const userId = req.user!.userId;

    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);

    if (start >= end) {
      res.status(400).json({ error: 'Start date must be before end date', code: 'BAD_REQUEST' });
      return;
    }

    if (!isWithinFestivalPeriod(start, end)) {
      res.status(400).json({ error: 'Reservation dates must be within the festival period (June - August)', code: 'BAD_REQUEST' });
      return;
    }

    if (containsMaintenanceDay(start, end)) {
      res.status(400).json({ error: 'Reservations cannot overlap with maintenance days (Tuesdays)', code: 'BAD_REQUEST' });
      return;
    }

    const reservation = await prisma.$transaction(async (tx) => {
      const isAvailable = await checkAvailability(parkId, start, end, tipo, numPersonas, tx as any);
      if (!isAvailable) {
        throw new Error('Cabañas agotadas para estas fechas');
      }

      return tx.reservation.create({
        data: {
          userId,
          parkId,
          fechaInicio: start,
          fechaFin: end,
          numPersonas,
          tipo,
          codigo: 'LUC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        },
        include: {
          user: true,
          park: true,
        }
      });
    });

    await sendConfirmationEmail(reservation.user.email, {
      id: reservation.id,
      codigo: reservation.codigo,
      parkName: reservation.park.nombre,
      fechaInicio: reservation.fechaInicio,
      fechaFin: reservation.fechaFin,
      numPersonas: reservation.numPersonas,
      tipo: reservation.tipo,
    });

    res.status(201).json({ data: reservation });
  } catch (error: any) {
    if (error.message === 'Cabañas agotadas para estas fechas') {
      res.status(409).json({ error: error.message, code: 'CONFLICT' });
      return;
    }
    next(error);
  }
};

export const getMyReservations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservations = await reservationsRepository.findByUserId(req.user!.userId);
    res.status(200).json({ data: reservations });
  } catch (error) {
    next(error);
  }
};

export const cancelReservation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservation = await reservationsRepository.findByIdAndUserId(req.params.id, req.user!.userId);
    if (!reservation) {
      res.status(404).json({ error: 'Reservation not found', code: 'NOT_FOUND' });
      return;
    }

    const cancelled = await reservationsRepository.updateStatus(reservation.id, 'CANCELLED');
    
    // Fetch park info for the email
    const park = await prisma.park.findUnique({ where: { id: reservation.parkId } });
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    
    if (user && park) {
      await sendCancellationEmail(user.email, { parkName: park.nombre });
    }

    res.status(200).json({ data: cancelled });
  } catch (error) {
    next(error);
  }
};

export const getAllReservations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservations = await reservationsRepository.findAll();
    res.status(200).json({ data: reservations });
  } catch (error) {
    next(error);
  }
};

export const validateReservation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { codigo } = req.body;
    if (!codigo) {
      res.status(400).json({ error: 'Código QR requerido' });
      return;
    }

    const reservation = await prisma.reservation.findUnique({
      where: { codigo },
      include: { user: true, park: true }
    });

    if (!reservation) {
      res.status(404).json({ error: 'Reservación no encontrada' });
      return;
    }

    if (reservation.status !== 'ACTIVE') {
      res.status(400).json({ error: `La reservación tiene estado: ${reservation.status}` });
      return;
    }

    // Update to ARRIVED
    const updated = await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: 'ARRIVED' },
      include: { user: true, park: true }
    });

    res.status(200).json({ message: 'Validación exitosa', data: updated });
  } catch (error) {
    next(error);
  }
};
