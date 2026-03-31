import { IBookmarkRepository } from "../../domain/repositories/IBookmarkRepository";
import { Bookmark } from "../../domain/aggregates/Bookmark";
import { BookmarkId } from "../../domain/value-objects/BookmarkId";

export class FindBookmarkByIdUseCase {
    constructor(private bookmarkRepository: IBookmarkRepository) { }

    async execute(id: string): Promise<Bookmark> {
        const bookmark = await this.bookmarkRepository.findById(BookmarkId.create(id));
        if (!bookmark) {
            throw new Error('Bookmark not found');
        }
        return bookmark;
    }
}