/// <reference types="jest" />

import { CreateBookmarkUseCase } from '../src/application/use-cases/CreateBookmarkUseCase';
import { IBookmarkRepository } from '../src/domain/repositories/IBookmarkRepository';
import { Bookmark } from '../src/domain/aggregates/Bookmark';
import { CreateBookmarkDTO } from '../src/application/dto/CreateBookmarkDTO';
import { prisma } from '../src/infrastructure/database/prisma';
import { PrismaBookmarkRepository } from '../src/infrastructure/repositories/BookmarkRepository';

// Mock the dependencies
jest.mock('../src/infrastructure/database/prisma', () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

jest.mock('../src/infrastructure/repositories/BookmarkRepository', () => ({
  PrismaBookmarkRepository: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

describe('CreateBookmarkUseCase', () => {
  let useCase: CreateBookmarkUseCase;
  let mockRepository: jest.Mocked<IBookmarkRepository>;
  let mockTx: any;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByUrl: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    };

    mockTx = {}; // Mock transaction client

    (PrismaBookmarkRepository as any).mockImplementation(() => mockRepository);

    (prisma as any).$transaction.mockImplementation(async (fn: (tx: any) => Promise<any>) => fn(mockTx));

    useCase = new CreateBookmarkUseCase(mockRepository); // Even though not used, for completeness
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a bookmark successfully when no duplicate exists', async () => {
    // Arrange
    const dto: CreateBookmarkDTO = {
      url: 'https://example.com',
      title: 'Example Title',
      description: 'Example Description',
      tags: ['tag1', 'tag2'],
    };

    mockRepository.findByUrl.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(mockRepository.findByUrl).toHaveBeenCalledWith(dto.url);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    const savedBookmark = mockRepository.save.mock.calls[0][0] as Bookmark;
    expect(savedBookmark.url).toBe(dto.url);
    expect(savedBookmark.title).toBe(dto.title);
    expect(savedBookmark.description).toBe(dto.description);
    expect(savedBookmark.tags).toEqual(dto.tags);
    expect(result).toBe(savedBookmark);
  });

  it('should throw an error when a bookmark with the same URL already exists', async () => {
    // Arrange
    const dto: CreateBookmarkDTO = {
      url: 'https://example.com',
      title: 'Example Title',
    };

    const existingBookmark = Bookmark.create('https://example.com', 'Existing Title');
    mockRepository.findByUrl.mockResolvedValue(existingBookmark);

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow('Bookmark already exists for this URL');
    expect(mockRepository.findByUrl).toHaveBeenCalledWith(dto.url);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should create a bookmark with minimal data', async () => {
    // Arrange
    const dto: CreateBookmarkDTO = {
      url: 'https://example.com',
      title: 'Example Title',
    };

    mockRepository.findByUrl.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result.url).toBe(dto.url);
    expect(result.title).toBe(dto.title);
    expect(result.description).toBeNull();
    expect(result.tags).toEqual([]);
  });
});