import { Tag } from "./Tag";

export class Tags {
    private constructor(private readonly _tags: Tag[]) { }

    static create(tags: string[] = []): Tags {
        const tagObjects = tags.map(tag => Tag.create(tag));

        // Remove duplicates
        const unique = tagObjects.filter((tag, index, self) =>
            index === self.findIndex(t => t.equals(tag))
        );

        // Limit number of tags
        if (unique.length > 10) {
            throw new Error('Cannot have more than 10 tags per bookmark');
        }

        return new Tags(unique);
    }

    get values(): Tag[] { return [...this._tags]; }
    get count(): number { return this._tags.length; }
    get asStrings(): string[] { return this._tags.map(t => t.name); }

    add(tag: Tag): Tags {
        if (this._tags.some(t => t.equals(tag))) {
            return this; // Tag already exists
        }

        if (this._tags.length >= 10) {
            throw new Error('Cannot add more than 10 tags');
        }

        return new Tags([...this._tags, tag]);
    }

    remove(tag: Tag): Tags {
        return new Tags(this._tags.filter(t => !t.equals(tag)));
    }

    contains(tag: Tag): boolean {
        return this._tags.some(t => t.equals(tag));
    }

    equals(other: Tags): boolean {
        if (this._tags.length !== other._tags.length) return false;

        const thisSorted = [...this._tags].sort((a, b) => a.name.localeCompare(b.name));
        const otherSorted = [...other._tags].sort((a, b) => a.name.localeCompare(b.name));

        return thisSorted.every((tag, index) => tag.equals(otherSorted[index]));
    }
}