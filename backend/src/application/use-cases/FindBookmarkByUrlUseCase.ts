import { IBookmarkRepository } from "../../domain/repositories/IBookmarkRepository";
import { Bookmark } from "../../domain/aggregates/Bookmark";

export class FindBookmarkByUrlUseCase {
    constructor(private bookmarkRepository: IBookmarkRepository) { }

    async execute(url: string): Promise<Bookmark> {
        const bookmark = await this.bookmarkRepository.findByUrl(url);
        if (!bookmark) {
            throw new Error('Bookmark not found');
        }
        return bookmark;
    }
}