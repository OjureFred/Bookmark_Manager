import { IBookmarkRepository } from '../../domain/repositories/IBookmarkRepository';
import { Bookmark } from '../../domain/aggregates/Bookmark';
import { BookmarkId } from '../../domain/value-objects/BookmarkId';
import { Url } from '../../domain/value-objects/Url';
import { CreateBookmarkDTO } from '../dto/CreateBookmarkDTO';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../infrastructure/database/prisma';
import { PrismaBookmarkRepository } from '../../infrastructure/repositories/BookmarkRepository';

export class CreateBookmarkUseCase {
    constructor(private bookmarkRepository: IBookmarkRepository) { }

    async execute(dto: CreateBookmarkDTO): Promise<Bookmark> {
        // Prisma Transaction (Replaces Manual Unit of Work)
        return await prisma.$transaction(async (tx) => {
            // Create a temporary repository with the transaction client
            const txRepository = new PrismaBookmarkRepository(tx);

            // 1. Check Business Rules
            const duplicate = await txRepository.findByUrl(dto.url);
            if (duplicate) {
                throw new Error('Bookmark already exists for this URL');
            }

            // 2. Create Aggregate
      const bookmark = Bookmark.create(
        dto.url,
        dto.title,
        dto.description,
        dto.tags || []
      );

            // 3. Save (Inside Transaction)
            await txRepository.save(bookmark);

            // 4. Return (Auto-commits if no error)
            return bookmark;
        });
        // Auto-rollback if error is thrown
    }
}