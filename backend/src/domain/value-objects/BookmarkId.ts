// domain/value-objects/BookmarkId.ts
import { v4 as uuidv4 } from 'uuid';

export class BookmarkId {
    private constructor(private readonly _value: string) { }

    static create(id?: string): BookmarkId {
        const value = id || uuidv4(); // Use your preferred UUID library

        // Validate UUID format if you're using UUIDs
        if (!this.isValidUuid(value)) {
            throw new Error('Invalid bookmark ID format');
        }

        return new BookmarkId(value);
    }

    private static isValidUuid(id: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }

    get value(): string { return this._value; }

    equals(other: BookmarkId): boolean {
        return this._value === other._value;
    }
}