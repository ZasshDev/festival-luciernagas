const { isWithinFestivalPeriod, containsMaintenanceDay } = require('./src/modules/reservations/availability.service');
const start = new Date('2026-06-15T10:00:00Z');
const end = new Date('2026-06-17T10:00:00Z');
console.log('Within?', isWithinFestivalPeriod(start, end));
console.log('Maintenance?', containsMaintenanceDay(start, end));
