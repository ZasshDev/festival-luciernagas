import { z } from 'zod';

export const createParkSchema = z.object({
  body: z.object({
    nombre: z.string().min(2, 'Name must be at least 2 characters'),
    direccion: z.string().min(5, 'Address is required'),
    servicios: z.string().min(5, 'Services info is required'),
    horario: z.string().min(5, 'Schedule info is required'),
    hasCabins: z.boolean(),
    stockCabanas: z.number().int().min(0).optional(),
    lat: z.number(),
    lng: z.number(),
  }),
});

export const updateParkSchema = z.object({
  body: createParkSchema.shape.body.partial(),
});
