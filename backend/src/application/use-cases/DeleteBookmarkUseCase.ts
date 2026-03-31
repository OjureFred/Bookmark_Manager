import { IBookmarkRepository } from "../../domain/repositories/IBookmarkRepository";
import { BookmarkId } from "../../domain/value-objects/BookmarkId";

export class DeleteBookmarkUseCase {
    constructor(private bookmarkRepository: IBookmarkRepository) { }

    async execute(id: string): Promise<void> {
        await this.bookmarkRepository.delete(BookmarkId.create(id));
    }
}