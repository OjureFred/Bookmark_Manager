/// <reference types="jest" />

import { Description } from '../src/domain/value-objects/Description';

describe('Description', () => {
  describe('create', () => {
    it('should create Description with valid string', () => {
      const descString = 'This is a description';
      const description = Description.create(descString);

      expect(description.value).toBe(descString);
    });

    it('should trim whitespace from description', () => {
      const description = Description.create('  My description  ');

      expect(description.value).toBe('My description');
    });

    it('should return null for null input', () => {
      const description = Description.create(null);

      expect(description.value).toBeNull();
    });

    it('should return null for undefined input', () => {
      const description = Description.create(undefined);

      expect(description.value).toBeNull();
    });

    it('should return null for empty string', () => {
      const description = Description.create('');

      expect(description.value).toBeNull();
    });

    it('should return null for whitespace only', () => {
      const description = Description.create('   ');

      expect(description.value).toBeNull();
    });

    it('should throw error for description exceeding 500 characters', () => {
      const longDesc = 'a'.repeat(501);
      expect(() => Description.create(longDesc)).toThrow('Description cannot exceed 500 characters');
    });

    it('should accept description exactly 500 characters', () => {
      const exactDesc = 'a'.repeat(500);
      const description = Description.create(exactDesc);

      expect(description.value).toBe(exactDesc);
    });
  });

  describe('hasValue', () => {
    it('should return true when description has value', () => {
      const description = Description.create('Has content');

      expect(description.hasValue).toBe(true);
    });

    it('should return false when description is null', () => {
      const description = Description.create(null);

      expect(description.hasValue).toBe(false);
    });
  });

  describe('getValueOrDefault', () => {
    it('should return value when description has content', () => {
      const description = Description.create('Content');

      expect(description.getValueOrDefault()).toBe('Content');
    });

    it('should return default value when description is null', () => {
      const description = Description.create(null);

      expect(description.getValueOrDefault('default')).toBe('default');
    });

    it('should return empty string as default when no default provided', () => {
      const description = Description.create(null);

      expect(description.getValueOrDefault()).toBe('');
    });
  });

  describe('toString', () => {
    it('should return value as string when description has content', () => {
      const description = Description.create('Content');

      expect(description.toString()).toBe('Content');
    });

    it('should return empty string when description is null', () => {
      const description = Description.create(null);

      expect(description.toString()).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal Descriptions', () => {
      const desc1 = Description.create('Same content');
      const desc2 = Description.create('Same content');

      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should return false for different Descriptions', () => {
      const desc1 = Description.create('Content one');
      const desc2 = Description.create('Content two');

      expect(desc1.equals(desc2)).toBe(false);
    });

    it('should return true for both null Descriptions', () => {
      const desc1 = Description.create(null);
      const desc2 = Description.create(null);

      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should return false for null vs non-null Descriptions', () => {
      const desc1 = Description.create(null);
      const desc2 = Description.create('Content');

      expect(desc1.equals(desc2)).toBe(false);
    });
  });
});