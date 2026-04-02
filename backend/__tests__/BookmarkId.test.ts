/// <reference types="jest" />

import { BookmarkId } from '../src/domain/value-objects/BookmarkId';

// Mock uuid to avoid ES module issues
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

describe('BookmarkId', () => {
  describe('create', () => {
    it('should create BookmarkId with provided valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const bookmarkId = BookmarkId.create(validUuid);

      expect(bookmarkId.value).toBe(validUuid);
    });

    it('should create BookmarkId with generated UUID when no id provided', () => {
      const bookmarkId = BookmarkId.create();

      expect(bookmarkId.value).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw error for invalid UUID format', () => {
      expect(() => BookmarkId.create('invalid-uuid')).toThrow('Invalid bookmark ID format');
      expect(() => BookmarkId.create('123')).toThrow('Invalid bookmark ID format');
      // Note: empty string generates a UUID, so it doesn't throw
    });
  });

  describe('equals', () => {
    it('should return true for equal BookmarkIds', () => {
      const id1 = BookmarkId.create('123e4567-e89b-12d3-a456-426614174000');
      const id2 = BookmarkId.create('123e4567-e89b-12d3-a456-426614174000');

      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different BookmarkIds', () => {
      const id1 = BookmarkId.create('123e4567-e89b-12d3-a456-426614174000');
      const id2 = BookmarkId.create('456e7890-e89b-12d3-a456-426614174001');

      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('value getter', () => {
    it('should return the UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const bookmarkId = BookmarkId.create(uuid);

      expect(bookmarkId.value).toBe(uuid);
    });
  });
});