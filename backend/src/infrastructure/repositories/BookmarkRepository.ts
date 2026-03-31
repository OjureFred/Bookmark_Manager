import { PrismaClient, Prisma } from '@prisma/client';
import { IBookmarkRepository } from '../../domain/repositories/IBookmarkRepository';
import { Bookmark } from '../../domain/aggregates/Bookmark';
import { BookmarkId } from '../../domain/value-objects/BookmarkId';
import { Url } from '../../domain/value-objects/Url';
import { prisma } from '../database/prisma';

export class PrismaBookmarkRepository implements IBookmarkRepository {
    constructor(private dbClient: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"> = prisma) { }

    // Mapper: Prisma → Domain Entity
    private mapToEntity(row: any): Bookmark {
        return Bookmark.reconstitute(
            row.id,
            row.url,
            row.title,
            row.description,
            row.tags as string[],
            row.createdAt,
            row.updatedAt
        );
    }

    // Mapper: Domain Entity → Prisma
    private mapToPrisma(bookmark: Bookmark): any {
        return {
            id: bookmark.id,
            url: bookmark.url,
            title: bookmark.title,
            description: bookmark.description ?? '',
            tags: bookmark.tags,
            createdAt: bookmark.createdAt,
            updatedAt: bookmark.updatedAt,
        };
    }

    async findById(id: BookmarkId): Promise<Bookmark | null> {
        const row = await this.dbClient.bookmark.findUnique({
            where: { id: id.value },
        });
        if (!row) return null;
        return this.mapToEntity(row);
    }

    async findByUrl(url: string): Promise<Bookmark | null> {
        const row = await this.dbClient.bookmark.findFirst({
            where: {
                url,
            },
        });
        if (!row) return null;
        return this.mapToEntity(row);
    }

    async save(bookmark: Bookmark): Promise<void> {
        const data = this.mapToPrisma(bookmark);

        await this.dbClient.bookmark.upsert({
            where: { id: data.id },
            update: {
                url: data.url,
                title: data.title,
                description: data.description,
                tags: data.tags,
                updatedAt: data.updatedAt,
            },
            create: {
                id: data.id,
                url: data.url,
                title: data.title,
                description: data.description,
                tags: data.tags,
            },
        });
    }

    async delete(id: BookmarkId): Promise<void> {
        await this.dbClient.bookmark.delete({
            where: { id: id.value },
        });
    }

    async getAll(): Promise<Bookmark[]> {
        const rows = await this.dbClient.bookmark.findMany();
        return rows.map((row: any) => this.mapToEntity(row));
    }
}