/// <reference types="jest" />

import { FindBookmarkByUrlUseCase } from '../src/application/use-cases/FindBookmarkByUrlUseCase';
import { IBookmarkRepository } from '../src/domain/repositories/IBookmarkRepository';
import { Bookmark } from '../src/domain/aggregates/Bookmark';

// Mock uuid to avoid ES module issues
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

describe('FindBookmarkByUrlUseCase', () => {
  let useCase: FindBookmarkByUrlUseCase;
  let mockRepository: jest.Mocked<IBookmarkRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByUrl: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    };

    useCase = new FindBookmarkByUrlUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a bookmark when found', async () => {
    // Arrange
    const url = 'https://example.com';
    const expectedBookmark = Bookmark.create(url, 'Test Title');
    mockRepository.findByUrl.mockResolvedValue(expectedBookmark);

    // Act
    const result = await useCase.execute(url);

    // Assert
    expect(mockRepository.findByUrl).toHaveBeenCalledWith(url);
    expect(result).toBe(expectedBookmark);
  });

  it('should throw an error when bookmark is not found', async () => {
    // Arrange
    const url = 'https://example.com';
    mockRepository.findByUrl.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(url)).rejects.toThrow('Bookmark not found');
    expect(mockRepository.findByUrl).toHaveBeenCalledWith(url);
  });
});