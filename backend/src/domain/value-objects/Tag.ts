// domain/value-objects/Tag.ts
export class Tag {
    private constructor(private readonly _name: string) { }

    static create(name: string): Tag {
        // Validate tag name
        if (!name || name.trim().length === 0) {
            throw new Error('Tag name cannot be empty');
        }

        if (name.length > 50) {
            throw new Error('Tag name cannot exceed 50 characters');
        }

        // Normalize: lowercase, trim, replace spaces with hyphens
        const normalized = name.trim().toLowerCase().replace(/\s+/g, '-');

        // Validate characters (alphanumeric, hyphens, underscores only)
        if (!/^[a-z0-9\-_]+$/.test(normalized)) {
            throw new Error('Tag can only contain letters, numbers, hyphens, and underscores');
        }

        return new Tag(normalized);
    }

    get name(): string { return this._name; }

    equals(other: Tag): boolean {
        return this._name === other._name;
    }
}