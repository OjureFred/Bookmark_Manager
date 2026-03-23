// domain/value-objects/BookmarkDate.ts
export class BookmarkDate {
    private constructor(private readonly _value: Date) { }

    static create(date?: Date): BookmarkDate {
        const now = date || new Date();

        if (isNaN(now.getTime())) {
            throw new Error('Invalid date');
        }

        return new BookmarkDate(now);
    }

    get value(): Date { return this._value; }

    // Domain-specific date operations
    isBefore(other: BookmarkDate): boolean {
        return this._value < other._value;
    }

    isAfter(other: BookmarkDate): boolean {
        return this._value > other._value;
    }

    equals(other: BookmarkDate): boolean {
        return this._value.getTime() === other._value.getTime();
    }

    // Format for display (domain doesn't care about presentation format)
    toISOString(): string {
        return this._value.toISOString();
    }
}