import { z } from 'zod';

export const createReservationSchema = z.object({
  body: z.object({
    parkId: z.string().uuid(),
    fechaInicio: z.string().datetime(),
    fechaFin: z.string().datetime(),
    numPersonas: z.number().int().min(1),
    tipo: z.enum(['CABIN', 'CAMPING']),
  }),
});
