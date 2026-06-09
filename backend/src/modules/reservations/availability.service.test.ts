import { describe, it, expect } from 'vitest';
import { isWithinFestivalPeriod, containsMaintenanceDay } from './availability.service';

describe('availability.service', () => {
  describe('isWithinFestivalPeriod', () => {
    it('accepts dates in June', () => {
      const start = new Date('2026-06-01T10:00:00Z');
      const end = new Date('2026-06-05T10:00:00Z');
      expect(isWithinFestivalPeriod(start, end)).toBe(true);
    });

    it('accepts dates in August', () => {
      const start = new Date('2026-08-10T10:00:00Z');
      const end = new Date('2026-08-15T10:00:00Z');
      expect(isWithinFestivalPeriod(start, end)).toBe(true);
    });

    it('rejects dates before June', () => {
      const start = new Date('2026-05-10T10:00:00Z');
      const end = new Date('2026-05-15T10:00:00Z');
      expect(isWithinFestivalPeriod(start, end)).toBe(false);
    });

    it('rejects dates after August', () => {
      const start = new Date('2026-09-01T10:00:00Z');
      const end = new Date('2026-09-05T10:00:00Z');
      expect(isWithinFestivalPeriod(start, end)).toBe(false);
    });

    it('rejects range that starts before and ends inside festival', () => {
      const start = new Date('2026-05-28T10:00:00Z');
      const end = new Date('2026-06-02T10:00:00Z');
      expect(isWithinFestivalPeriod(start, end)).toBe(false);
    });
  });

  describe('containsMaintenanceDay', () => {
    it('detects a Tuesday within the range', () => {
      // 2026-06-08 is Monday, 06-10 is Wednesday. Tuesday is 06-09.
      const start = new Date('2026-06-08T10:00:00Z');
      const end = new Date('2026-06-10T10:00:00Z');
      expect(containsMaintenanceDay(start, end)).toBe(true);
    });

    it('returns false when no Tuesday in range', () => {
      // 2026-06-10 is Wednesday, 06-12 is Friday.
      const start = new Date('2026-06-10T10:00:00Z');
      const end = new Date('2026-06-12T10:00:00Z');
      expect(containsMaintenanceDay(start, end)).toBe(false);
    });

    it('detects Tuesday on the start date itself', () => {
      // 2026-06-09 is Tuesday
      const start = new Date('2026-06-09T10:00:00Z');
      const end = new Date('2026-06-10T10:00:00Z');
      expect(containsMaintenanceDay(start, end)).toBe(true);
    });

    it('detects Tuesday on the end date itself', () => {
      // 2026-06-08 is Monday, 06-09 is Tuesday
      const start = new Date('2026-06-08T10:00:00Z');
      const end = new Date('2026-06-09T10:00:00Z');
      expect(containsMaintenanceDay(start, end)).toBe(true);
    });
  });
});
