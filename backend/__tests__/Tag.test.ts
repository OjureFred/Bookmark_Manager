/// <reference types="jest" />

import { Tag } from '../src/domain/value-objects/Tag';

describe('Tag', () => {
  describe('create', () => {
    it('should create Tag with valid name', () => {
      const tag = Tag.create('javascript');

      expect(tag.name).toBe('javascript');
    });

    it('should normalize tag name to lowercase', () => {
      const tag = Tag.create('JavaScript');

      expect(tag.name).toBe('javascript');
    });

    it('should replace spaces with hyphens', () => {
      const tag = Tag.create('web development');

      expect(tag.name).toBe('web-development');
    });

    it('should trim whitespace', () => {
      const tag = Tag.create('  react  ');

      expect(tag.name).toBe('react');
    });

    it('should handle multiple spaces and normalization', () => {
      const tag = Tag.create('  Web Development  ');

      expect(tag.name).toBe('web-development');
    });

    it('should accept hyphens and underscores', () => {
      const tag1 = Tag.create('web-dev');
      const tag2 = Tag.create('front_end');

      expect(tag1.name).toBe('web-dev');
      expect(tag2.name).toBe('front_end');
    });

    it('should throw error for empty name', () => {
      expect(() => Tag.create('')).toThrow('Tag name cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => Tag.create('   ')).toThrow('Tag name cannot be empty');
    });

    it('should throw error for name exceeding 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => Tag.create(longName)).toThrow('Tag name cannot exceed 50 characters');
    });

    it('should accept name exactly 50 characters', () => {
      const exactName = 'a'.repeat(50);
      const tag = Tag.create(exactName);

      expect(tag.name).toBe(exactName);
    });

    it('should throw error for invalid characters', () => {
      expect(() => Tag.create('tag@name')).toThrow('Tag can only contain letters, numbers, hyphens, and underscores');
      expect(() => Tag.create('tag.name')).toThrow('Tag can only contain letters, numbers, hyphens, and underscores');
      expect(() => Tag.create('tag name!')).toThrow('Tag can only contain letters, numbers, hyphens, and underscores');
    });
  });

  describe('equals', () => {
    it('should return true for equal Tags', () => {
      const tag1 = Tag.create('javascript');
      const tag2 = Tag.create('javascript');

      expect(tag1.equals(tag2)).toBe(true);
    });

    it('should return false for different Tags', () => {
      const tag1 = Tag.create('javascript');
      const tag2 = Tag.create('react');

      expect(tag1.equals(tag2)).toBe(false);
    });

    it('should be case insensitive for equality', () => {
      const tag1 = Tag.create('JavaScript');
      const tag2 = Tag.create('javascript');

      expect(tag1.equals(tag2)).toBe(true);
    });
  });

  describe('name getter', () => {
    it('should return the normalized tag name', () => {
      const tag = Tag.create('Web Development');

      expect(tag.name).toBe('web-development');
    });
  });
});