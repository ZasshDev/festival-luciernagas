import { PrismaClient } from '@prisma/client';
import { FESTIVAL_START_MONTH, FESTIVAL_END_MONTH, MAINTENANCE_DAY } from '../../constants/festival';

export function isWithinFestivalPeriod(start: Date, end: Date): boolean {
  return start.getUTCMonth() >= FESTIVAL_START_MONTH && end.getUTCMonth() <= FESTIVAL_END_MONTH;
}

export function containsMaintenanceDay(start: Date, end: Date): boolean {
  const current = new Date(start);
  while (current <= end) {
    if (current.getUTCDay() === MAINTENANCE_DAY) return true;
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return false;
}

export async function checkAvailability(
  parkId: string,
  start: Date,
  end: Date,
  tipo: string,
  numPersonas: number,
  prisma: PrismaClient
): Promise<boolean> {
  const park = await prisma.park.findUnique({ where: { id: parkId } });
  if (!park) return false;

  // Let's define capacity rules:
  // CABIN: 10 people max per cabin
  // CAMPING: 4 people max per space (stockCamping)
  
  if (tipo === 'CABIN') {
    const requiredCabins = Math.ceil(numPersonas / 10);
    const overlapping = await prisma.reservation.findMany({
      where: {
        parkId,
        tipo: 'CABIN',
        status: 'ACTIVE',
        OR: [
          {
            fechaInicio: { lte: end },
            fechaFin: { gte: start },
          },
        ],
      },
    });
    
    const usedCabins = overlapping.reduce((total, res) => total + Math.ceil(res.numPersonas / 10), 0);
    return (usedCabins + requiredCabins) <= park.stockCabanas;
  }

  if (tipo === 'CAMPING') {
    const requiredSpaces = Math.ceil(numPersonas / 4);
    const overlapping = await prisma.reservation.findMany({
      where: {
        parkId,
        tipo: 'CAMPING',
        status: 'ACTIVE',
        OR: [
          {
            fechaInicio: { lte: end },
            fechaFin: { gte: start },
          },
        ],
      },
    });
    
    // We assume camping has a stock default of 50 spaces, accessed via (park as any).stockCamping because we might not have regenerated prisma client yet.
    const maxCamping = (park as any).stockCamping || 50;
    const usedSpaces = overlapping.reduce((total, res) => total + Math.ceil(res.numPersonas / 4), 0);
    return (usedSpaces + requiredSpaces) <= maxCamping;
  }

  return true;

}
