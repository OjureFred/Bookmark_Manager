/// <reference types="jest" />

import { FindBookmarkByIdUseCase } from '../src/application/use-cases/FindBookmarkByIdUseCase';
import { IBookmarkRepository } from '../src/domain/repositories/IBookmarkRepository';
import { Bookmark } from '../src/domain/aggregates/Bookmark';

// Mock uuid to avoid ES module issues
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

describe('FindBookmarkByIdUseCase', () => {
  let useCase: FindBookmarkByIdUseCase;
  let mockRepository: jest.Mocked<IBookmarkRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByUrl: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    };

    useCase = new FindBookmarkByIdUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a bookmark when found', async () => {
    // Arrange
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const expectedBookmark = Bookmark.create('https://example.com', 'Test Title');
    mockRepository.findById.mockResolvedValue(expectedBookmark);

    // Act
    const result = await useCase.execute(id);

    // Assert
    expect(mockRepository.findById).toHaveBeenCalledWith(expect.objectContaining({ value: id }));
    expect(result).toBe(expectedBookmark);
  });

  it('should throw an error when bookmark is not found', async () => {
    // Arrange
    const id = '123e4567-e89b-12d3-a456-426614174000';
    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(id)).rejects.toThrow('Bookmark not found');
    expect(mockRepository.findById).toHaveBeenCalledWith(expect.objectContaining({ value: id }));
  });
});