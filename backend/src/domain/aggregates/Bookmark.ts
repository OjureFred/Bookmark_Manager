// domain/aggregates/Bookmark.ts

import { Url } from '../value-objects/Url';
import { Title } from '../value-objects/Title';
import { Description } from '../value-objects/Description';
import { Tag } from '../value-objects/Tag';
import { Tags } from '../value-objects/Tags';
import { BookmarkId } from '../value-objects/BookmarkId';
import { BookmarkDate } from '../value-objects/BookmarkDate';


export class Bookmark {
    private constructor(
        private readonly _id: BookmarkId,
        private _url: Url,
        private _title: Title,
        private _description: Description,
        private _tags: Tags,
        private _createdAt: BookmarkDate,
        private _updatedAt: BookmarkDate
    ) { }

    // Factory method for new bookmarks
    static create(
        url: string,
        title: string,
        description?: string,
        tags: string[] = []
    ): Bookmark {
        const now = BookmarkDate.create();

        return new Bookmark(
            BookmarkId.create(),
            Url.create(url),
            Title.create(title),
            Description.create(description),
            Tags.create(tags),
            now,
            now
        );
    }

    // Reconstruct from persistence
    static reconstitute(
        id: string,
        url: string,
        title: string,
        description: string | null,
        tags: string[],
        createdAt: Date,
        updatedAt: Date
    ): Bookmark {
        return new Bookmark(
            BookmarkId.create(id),
            Url.create(url),
            Title.create(title),
            Description.create(description),
            Tags.create(tags),
            BookmarkDate.create(createdAt),
            BookmarkDate.create(updatedAt)
        );
    }

    // Domain behavior
    updateTitle(newTitle: string): void {
        this._title = Title.create(newTitle);
        this._updatedAt = BookmarkDate.create();
    }

    updateDescription(newDescription?: string): void {
        this._description = Description.create(newDescription);
        this._updatedAt = BookmarkDate.create();
    }

    addTag(tagName: string): void {
        const tag = Tag.create(tagName);
        this._tags = this._tags.add(tag);
        this._updatedAt = BookmarkDate.create();
    }

    removeTag(tagName: string): void {
        const tag = Tag.create(tagName);
        this._tags = this._tags.remove(tag);
        this._updatedAt = BookmarkDate.create();
    }


    // Getters (expose immutably)
    get id(): string { return this._id.value; }
    get url(): string { return this._url.value; }
    get domain(): string { return this._url.domain; }
    get title(): string { return this._title.value; }
    get description(): string | null { return this._description.value; }
    get tags(): string[] { return this._tags.asStrings; }
    get createdAt(): Date { return this._createdAt.value; }
    get updatedAt(): Date { return this._updatedAt.value; }
}