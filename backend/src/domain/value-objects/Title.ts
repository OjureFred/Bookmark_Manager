// domain/value-objects/Title.ts
export class Title {
    private constructor(private readonly _value: string) { }

    static create(value: string): Title {
        if (!value || value.trim().length === 0) {
            throw new Error('Title cannot be empty');
        }

        if (value.length > 200) {
            throw new Error('Title cannot exceed 200 characters');
        }

        // Trim whitespace
        const trimmed = value.trim();

        return new Title(trimmed);
    }

    get value(): string { return this._value; }

    equals(other: Title): boolean {
        return this._value === other._value;
    }
}