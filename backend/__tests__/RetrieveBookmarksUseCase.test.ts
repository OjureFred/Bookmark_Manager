/// <reference types="jest" />

import { RetrieveBookmarksUseCase } from '../src/application/use-cases/RetrieveBookmarksUseCase';
import { IBookmarkRepository } from '../src/domain/repositories/IBookmarkRepository';
import { Bookmark } from '../src/domain/aggregates/Bookmark';

// Mock uuid to avoid ES module issues
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

describe('RetrieveBookmarksUseCase', () => {
  let useCase: RetrieveBookmarksUseCase;
  let mockRepository: jest.Mocked<IBookmarkRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByUrl: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    };

    useCase = new RetrieveBookmarksUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array when no bookmarks exist', async () => {
    // Arrange
    mockRepository.getAll.mockResolvedValue([]);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('should return all bookmarks when they exist', async () => {
    // Arrange
    const bookmark1 = Bookmark.create('https://example1.com', 'Title 1');
    const bookmark2 = Bookmark.create('https://example2.com', 'Title 2');
    const expectedBookmarks = [bookmark1, bookmark2];
    mockRepository.getAll.mockResolvedValue(expectedBookmarks);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toBe(expectedBookmarks);
  });
});