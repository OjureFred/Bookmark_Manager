/// <reference types="jest" />

import { UpdateBookmarkUseCase } from '../src/application/use-cases/UpdateBookmarkUseCase';
import { IBookmarkRepository } from '../src/domain/repositories/IBookmarkRepository';
import { Bookmark } from '../src/domain/aggregates/Bookmark';
import { UpdateBookmarkDTO } from '../src/application/dto/UpdateBookmarkDTO';

// Mock uuid to avoid ES module issues
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

describe('UpdateBookmarkUseCase', () => {
  let useCase: UpdateBookmarkUseCase;
  let mockRepository: jest.Mocked<IBookmarkRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByUrl: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    };

    useCase = new UpdateBookmarkUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a bookmark successfully when it exists', async () => {
    // Arrange
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const dto: UpdateBookmarkDTO = {
      title: 'Updated Title',
    };

    const existingBookmark = Bookmark.create('https://example.com', 'Original Title');
    mockRepository.findById.mockResolvedValue(existingBookmark);
    mockRepository.save.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute(id, dto);

    // Assert
    expect(mockRepository.findById).toHaveBeenCalledWith(expect.objectContaining({ value: id }));
    expect(mockRepository.save).toHaveBeenCalledWith(existingBookmark);
    expect(result).toBe(existingBookmark);
  });

  it('should throw an error when bookmark is not found', async () => {
    // Arrange
    const id = '123e4567-e89b-12d3-a456-426614174000';
    const dto: UpdateBookmarkDTO = {
      title: 'Updated Title',
    };

    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(id, dto)).rejects.toThrow('Bookmark not found');
    expect(mockRepository.findById).toHaveBeenCalledWith(expect.objectContaining({ value: id }));
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});