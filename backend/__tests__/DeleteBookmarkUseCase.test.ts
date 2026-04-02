/// <reference types="jest" />

import { DeleteBookmarkUseCase } from '../src/application/use-cases/DeleteBookmarkUseCase';
import { IBookmarkRepository } from '../src/domain/repositories/IBookmarkRepository';

// Mock uuid to avoid ES module issues
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

describe('DeleteBookmarkUseCase', () => {
  let useCase: DeleteBookmarkUseCase;
  let mockRepository: jest.Mocked<IBookmarkRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByUrl: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    };

    useCase = new DeleteBookmarkUseCase(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a bookmark successfully', async () => {
    // Arrange
    const id = '123e4567-e89b-12d3-a456-426614174000';
    mockRepository.delete.mockResolvedValue(undefined);

    // Act
    await useCase.execute(id);

    // Assert
    expect(mockRepository.delete).toHaveBeenCalledWith(expect.objectContaining({ value: id }));
    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
  });
});