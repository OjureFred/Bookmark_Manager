import { IBookmarkRepository } from "../../domain/repositories/IBookmarkRepository";
import { Bookmark } from "../../domain/aggregates/Bookmark";
import { BookmarkId } from "../../domain/value-objects/BookmarkId";
import { UpdateBookmarkDTO } from "../dto/UpdateBookmarkDTO";

export class UpdateBookmarkUseCase {
    constructor(private bookmarkRepository: IBookmarkRepository) { }

    async execute(id: string, dto: UpdateBookmarkDTO): Promise<Bookmark> {
        const bookmark = await this.bookmarkRepository.findById(BookmarkId.create(id));
        if (!bookmark) {
            throw new Error('Bookmark not found');
        }
        await this.bookmarkRepository.save(bookmark);
        return bookmark;
    }
}