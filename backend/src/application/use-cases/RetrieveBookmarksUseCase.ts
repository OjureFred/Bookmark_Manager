import { IBookmarkRepository } from "../../domain/repositories/IBookmarkRepository";
import { Bookmark } from "../../domain/aggregates/Bookmark";

export class RetrieveBookmarksUseCase {
    constructor(private bookmarkRepository: IBookmarkRepository) { }

    async execute(): Promise<Bookmark[]> {
        return await this.bookmarkRepository.getAll();
    }
}