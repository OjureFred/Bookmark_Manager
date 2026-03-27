import { Bookmark } from '../aggregates/Bookmark';
import { BookmarkId } from '../value-objects/BookmarkId';

export interface IBookmarkRepository {
    findById(id: BookmarkId): Promise<Bookmark | null>;
    findByUrl(url: string): Promise<Bookmark | null>;
    save(bookmark: Bookmark): Promise<void>;
    delete(id: BookmarkId): Promise<void>;
}