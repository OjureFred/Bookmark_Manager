/// <reference types="jest" />

import { BookmarkDate } from '../src/domain/value-objects/BookmarkDate';

describe('BookmarkDate', () => {
  describe('create', () => {
    it('should create BookmarkDate with provided valid date', () => {
      const testDate = new Date('2023-01-01T12:00:00Z');
      const bookmarkDate = BookmarkDate.create(testDate);

      expect(bookmarkDate.value).toEqual(testDate);
    });

    it('should create BookmarkDate with current date when no date provided', () => {
      const before = new Date();
      const bookmarkDate = BookmarkDate.create();
      const after = new Date();

      expect(bookmarkDate.value.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(bookmarkDate.value.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should throw error for invalid date', () => {
      const invalidDate = new Date('invalid');
      expect(() => BookmarkDate.create(invalidDate)).toThrow('Invalid date');
    });
  });

  describe('comparisons', () => {
    const date1 = new Date('2023-01-01T12:00:00Z');
    const date2 = new Date('2023-01-02T12:00:00Z');

    it('isBefore should return true when date is before other', () => {
      const bookmarkDate1 = BookmarkDate.create(date1);
      const bookmarkDate2 = BookmarkDate.create(date2);

      expect(bookmarkDate1.isBefore(bookmarkDate2)).toBe(true);
      expect(bookmarkDate2.isBefore(bookmarkDate1)).toBe(false);
    });

    it('isAfter should return true when date is after other', () => {
      const bookmarkDate1 = BookmarkDate.create(date1);
      const bookmarkDate2 = BookmarkDate.create(date2);

      expect(bookmarkDate2.isAfter(bookmarkDate1)).toBe(true);
      expect(bookmarkDate1.isAfter(bookmarkDate2)).toBe(false);
    });

    it('equals should return true for same dates', () => {
      const bookmarkDate1 = BookmarkDate.create(date1);
      const bookmarkDate2 = BookmarkDate.create(date1);

      expect(bookmarkDate1.equals(bookmarkDate2)).toBe(true);
    });

    it('equals should return false for different dates', () => {
      const bookmarkDate1 = BookmarkDate.create(date1);
      const bookmarkDate2 = BookmarkDate.create(date2);

      expect(bookmarkDate1.equals(bookmarkDate2)).toBe(false);
    });
  });

  describe('toISOString', () => {
    it('should return ISO string representation', () => {
      const testDate = new Date('2023-01-01T12:00:00Z');
      const bookmarkDate = BookmarkDate.create(testDate);

      expect(bookmarkDate.toISOString()).toBe('2023-01-01T12:00:00.000Z');
    });
  });

  describe('value getter', () => {
    it('should return the Date object', () => {
      const testDate = new Date('2023-01-01T12:00:00Z');
      const bookmarkDate = BookmarkDate.create(testDate);

      expect(bookmarkDate.value).toBe(testDate);
    });
  });
});