/// <reference types="jest" />

import { Bookmark } from '../src/domain/aggregates/Bookmark';

// Mock uuid to avoid ES module issues
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

// Use Jest fake timers to control time
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

const mockDate = new Date('2023-01-01T12:00:00Z');
const mockDate2 = new Date('2023-01-01T12:00:01Z');

beforeEach(() => {
  jest.setSystemTime(mockDate);
});

describe('Bookmark', () => {
  describe('create', () => {
    it('should create bookmark with required fields', () => {
      const url = 'https://example.com';
      const title = 'Example Title';

      const bookmark = Bookmark.create(url, title);

      expect(bookmark.url).toBe('https://example.com');
      expect(bookmark.title).toBe('Example Title');
      expect(bookmark.description).toBeNull();
      expect(bookmark.tags).toEqual([]);
      expect(bookmark.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(bookmark.createdAt).toBeInstanceOf(Date);
      expect(bookmark.updatedAt).toBeInstanceOf(Date);
    });

    it('should create bookmark with all fields', () => {
      const url = 'https://example.com';
      const title = 'Example Title';
      const description = 'Example Description';
      const tags = ['javascript', 'web'];

      const bookmark = Bookmark.create(url, title, description, tags);

      expect(bookmark.url).toBe('https://example.com');
      expect(bookmark.title).toBe('Example Title');
      expect(bookmark.description).toBe('Example Description');
      expect(bookmark.tags).toEqual(['javascript', 'web']);
    });

    it('should normalize URL when creating', () => {
      const bookmark = Bookmark.create('example.com', 'Title');

      expect(bookmark.url).toBe('https://example.com');
    });

    it('should throw error for invalid URL', () => {
      expect(() => Bookmark.create('invalid-url', 'Title')).toThrow('Invalid URL format');
    });

    it('should throw error for invalid title', () => {
      expect(() => Bookmark.create('https://example.com', '')).toThrow('Title cannot be empty');
    });
  });

  describe('reconstitute', () => {
    it('should recreate bookmark from persistence data', () => {
      const id = '456e7890-e89b-12d3-a456-426614174001';
      const url = 'https://example.com';
      const title = 'Example Title';
      const description = 'Example Description';
      const tags = ['javascript'];
      const createdAt = new Date('2023-01-01T10:00:00Z');
      const updatedAt = new Date('2023-01-02T10:00:00Z');

      const bookmark = Bookmark.reconstitute(id, url, title, description, tags, createdAt, updatedAt);

      expect(bookmark.id).toBe(id);
      expect(bookmark.url).toBe(url);
      expect(bookmark.title).toBe(title);
      expect(bookmark.description).toBe(description);
      expect(bookmark.tags).toEqual(tags);
      expect(bookmark.createdAt).toEqual(createdAt);
      expect(bookmark.updatedAt).toEqual(updatedAt);
    });

    it('should handle null description in reconstitution', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const bookmark = Bookmark.reconstitute(
        validUuid,
        'https://example.com',
        'Title',
        null,
        [],
        new Date(),
        new Date()
      );

      expect(bookmark.description).toBeNull();
    });
  });

  describe('updateTitle', () => {
    it('should update title and updatedAt timestamp', () => {
      const bookmark = Bookmark.create('https://example.com', 'Original Title');
      const originalUpdatedAt = bookmark.updatedAt;

      // Advance time
      jest.setSystemTime(mockDate2);

      bookmark.updateTitle('New Title');

      expect(bookmark.title).toBe('New Title');
      expect(bookmark.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should throw error for invalid title', () => {
      const bookmark = Bookmark.create('https://example.com', 'Original Title');

      expect(() => bookmark.updateTitle('')).toThrow('Title cannot be empty');
    });
  });

  describe('updateDescription', () => {
    it('should update description and updatedAt timestamp', () => {
      const bookmark = Bookmark.create('https://example.com', 'Title');
      const originalUpdatedAt = bookmark.updatedAt;

      jest.setSystemTime(mockDate2);

      bookmark.updateDescription('New Description');

      expect(bookmark.description).toBe('New Description');
      expect(bookmark.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should set description to null when updating with null/undefined', () => {
      const bookmark = Bookmark.create('https://example.com', 'Title', 'Original Description');

      bookmark.updateDescription(undefined);

      expect(bookmark.description).toBeNull();
    });
  });

  describe('addTag', () => {
    it('should add tag and update timestamp', () => {
      const bookmark = Bookmark.create('https://example.com', 'Title');
      const originalUpdatedAt = bookmark.updatedAt;

      jest.setSystemTime(mockDate2);

      bookmark.addTag('javascript');

      expect(bookmark.tags).toEqual(['javascript']);
      expect(bookmark.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should not add duplicate tag', () => {
      const bookmark = Bookmark.create('https://example.com', 'Title', undefined, ['javascript']);

      bookmark.addTag('javascript');

      expect(bookmark.tags).toEqual(['javascript']);
    });

    it('should throw error for invalid tag', () => {
      const bookmark = Bookmark.create('https://example.com', 'Title');

      expect(() => bookmark.addTag('invalid@tag')).toThrow('Tag can only contain letters, numbers, hyphens, and underscores');
    });
  });

  describe('removeTag', () => {
    it('should remove existing tag and update timestamp', () => {
      const bookmark = Bookmark.create('https://example.com', 'Title', undefined, ['javascript', 'react']);
      const originalUpdatedAt = bookmark.updatedAt;

      jest.setSystemTime(mockDate2);

      bookmark.removeTag('javascript');

      expect(bookmark.tags).toEqual(['react']);
      expect(bookmark.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should not change tags when removing non-existent tag', () => {
      const bookmark = Bookmark.create('https://example.com', 'Title', undefined, ['javascript']);

      bookmark.removeTag('nonexistent');

      expect(bookmark.tags).toEqual(['javascript']);
    });
  });

  describe('getters', () => {
    it('should return correct domain from URL', () => {
      const bookmark = Bookmark.create('https://sub.example.com/path', 'Title');

      expect(bookmark.domain).toBe('sub.example.com');
    });

    it('should return all properties correctly', () => {
      const createdAt = new Date('2023-01-01T10:00:00Z');
      const updatedAt = new Date('2023-01-02T10:00:00Z');

      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const bookmark = Bookmark.reconstitute(
        validUuid,
        'https://example.com',
        'Test Title',
        'Test Description',
        ['tag1', 'tag2'],
        createdAt,
        updatedAt
      );

      expect(bookmark.id).toBe(validUuid);
      expect(bookmark.url).toBe('https://example.com');
      expect(bookmark.title).toBe('Test Title');
      expect(bookmark.description).toBe('Test Description');
      expect(bookmark.tags).toEqual(['tag1', 'tag2']);
      expect(bookmark.createdAt).toBe(createdAt);
      expect(bookmark.updatedAt).toBe(updatedAt);
    });
  });
});