/// <reference types="jest" />

import { Tags } from '../src/domain/value-objects/Tags';
import { Tag } from '../src/domain/value-objects/Tag';

describe('Tags', () => {
  describe('create', () => {
    it('should create Tags with empty array', () => {
      const tags = Tags.create([]);

      expect(tags.count).toBe(0);
      expect(tags.asStrings).toEqual([]);
    });

    it('should create Tags with valid tag strings', () => {
      const tags = Tags.create(['javascript', 'react']);

      expect(tags.count).toBe(2);
      expect(tags.asStrings).toEqual(['javascript', 'react']);
    });

    it('should remove duplicate tags', () => {
      const tags = Tags.create(['javascript', 'react', 'javascript']);

      expect(tags.count).toBe(2);
      expect(tags.asStrings).toEqual(['javascript', 'react']);
    });

    it('should normalize tag names', () => {
      const tags = Tags.create(['Web Development', 'REACT']);

      expect(tags.asStrings).toEqual(['web-development', 'react']);
    });

    it('should throw error when creating with more than 10 tags', () => {
      const tagArray = Array.from({ length: 11 }, (_, i) => `tag${i}`);
      expect(() => Tags.create(tagArray)).toThrow('Cannot have more than 10 tags per bookmark');
    });

    it('should accept exactly 10 tags', () => {
      const tagArray = Array.from({ length: 10 }, (_, i) => `tag${i}`);
      const tags = Tags.create(tagArray);

      expect(tags.count).toBe(10);
    });

    it('should throw error for invalid tag', () => {
      expect(() => Tags.create(['valid', 'invalid@tag'])).toThrow('Tag can only contain letters, numbers, hyphens, and underscores');
    });
  });

  describe('add', () => {
    it('should add new tag to existing tags', () => {
      const tags = Tags.create(['javascript']);
      const newTag = Tag.create('react');

      const updatedTags = tags.add(newTag);

      expect(updatedTags.count).toBe(2);
      expect(updatedTags.asStrings).toEqual(['javascript', 'react']);
    });

    it('should not add duplicate tag', () => {
      const tags = Tags.create(['javascript']);
      const duplicateTag = Tag.create('javascript');

      const updatedTags = tags.add(duplicateTag);

      expect(updatedTags.count).toBe(1);
      expect(updatedTags.asStrings).toEqual(['javascript']);
      expect(updatedTags).toBe(tags); // Should return same instance
    });

    it('should throw error when adding to tags that already have 10 tags', () => {
      const tagArray = Array.from({ length: 10 }, (_, i) => `tag${i}`);
      const tags = Tags.create(tagArray);
      const newTag = Tag.create('newtag');

      expect(() => tags.add(newTag)).toThrow('Cannot add more than 10 tags');
    });
  });

  describe('remove', () => {
    it('should remove existing tag', () => {
      const tags = Tags.create(['javascript', 'react']);
      const tagToRemove = Tag.create('react');

      const updatedTags = tags.remove(tagToRemove);

      expect(updatedTags.count).toBe(1);
      expect(updatedTags.asStrings).toEqual(['javascript']);
    });

    it('should not change tags when removing non-existent tag', () => {
      const tags = Tags.create(['javascript']);
      const nonExistentTag = Tag.create('react');

      const updatedTags = tags.remove(nonExistentTag);

      expect(updatedTags.count).toBe(1);
      expect(updatedTags.asStrings).toEqual(['javascript']);
    });
  });

  describe('contains', () => {
    it('should return true for existing tag', () => {
      const tags = Tags.create(['javascript', 'react']);
      const tag = Tag.create('javascript');

      expect(tags.contains(tag)).toBe(true);
    });

    it('should return false for non-existing tag', () => {
      const tags = Tags.create(['javascript']);
      const tag = Tag.create('react');

      expect(tags.contains(tag)).toBe(false);
    });
  });

  describe('getters', () => {
    it('should return correct count', () => {
      const tags = Tags.create(['javascript', 'react', 'vue']);

      expect(tags.count).toBe(3);
    });

    it('should return values as Tag array', () => {
      const tags = Tags.create(['javascript']);
      const tagObjects = tags.values;

      expect(tagObjects).toHaveLength(1);
      expect(tagObjects[0]).toBeInstanceOf(Tag);
      expect(tagObjects[0].name).toBe('javascript');
    });

    it('should return asStrings array', () => {
      const tags = Tags.create(['javascript', 'react']);

      expect(tags.asStrings).toEqual(['javascript', 'react']);
    });
  });

  describe('equals', () => {
    it('should return true for equal Tags collections', () => {
      const tags1 = Tags.create(['javascript', 'react']);
      const tags2 = Tags.create(['react', 'javascript']); // Different order

      expect(tags1.equals(tags2)).toBe(true);
    });

    it('should return false for different Tags collections', () => {
      const tags1 = Tags.create(['javascript', 'react']);
      const tags2 = Tags.create(['javascript', 'vue']);

      expect(tags1.equals(tags2)).toBe(false);
    });

    it('should return false for different lengths', () => {
      const tags1 = Tags.create(['javascript']);
      const tags2 = Tags.create(['javascript', 'react']);

      expect(tags1.equals(tags2)).toBe(false);
    });

    it('should return true for empty collections', () => {
      const tags1 = Tags.create([]);
      const tags2 = Tags.create([]);

      expect(tags1.equals(tags2)).toBe(true);
    });
  });
});