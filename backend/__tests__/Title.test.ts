/// <reference types="jest" />

import { Title } from '../src/domain/value-objects/Title';

describe('Title', () => {
  describe('create', () => {
    it('should create Title with valid string', () => {
      const titleString = 'My Bookmark Title';
      const title = Title.create(titleString);

      expect(title.value).toBe(titleString);
    });

    it('should trim whitespace from title', () => {
      const title = Title.create('  My Title  ');

      expect(title.value).toBe('My Title');
    });

    it('should throw error for empty string', () => {
      expect(() => Title.create('')).toThrow('Title cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => Title.create('   ')).toThrow('Title cannot be empty');
    });

    it('should throw error for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      expect(() => Title.create(longTitle)).toThrow('Title cannot exceed 200 characters');
    });

    it('should accept title exactly 200 characters', () => {
      const exactTitle = 'a'.repeat(200);
      const title = Title.create(exactTitle);

      expect(title.value).toBe(exactTitle);
    });
  });

  describe('equals', () => {
    it('should return true for equal Titles', () => {
      const title1 = Title.create('Test Title');
      const title2 = Title.create('Test Title');

      expect(title1.equals(title2)).toBe(true);
    });

    it('should return false for different Titles', () => {
      const title1 = Title.create('Title One');
      const title2 = Title.create('Title Two');

      expect(title1.equals(title2)).toBe(false);
    });
  });

  describe('value getter', () => {
    it('should return the title string', () => {
      const titleString = 'My Title';
      const title = Title.create(titleString);

      expect(title.value).toBe(titleString);
    });
  });
});