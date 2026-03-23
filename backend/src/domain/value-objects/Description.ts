// domain/value-objects/Description.ts
export class Description {
    private constructor(private readonly _value: string | null) { }

    static create(value?: string | null): Description {
        // Handle null, undefined, or empty string as "no description"
        if (value === null || value === undefined || value.trim().length === 0) {
            return new Description(null);
        }

        // Validate length
        if (value.length > 500) {
            throw new Error('Description cannot exceed 500 characters');
        }

        // Store trimmed value
        const trimmed = value.trim();
        return new Description(trimmed);
    }

    get value(): string | null {
        return this._value;
    }

    get hasValue(): boolean {
        return this._value !== null;
    }

    // Helper to get value or default
    getValueOrDefault(defaultValue: string = ''): string {
        return this._value ?? defaultValue;
    }

    equals(other: Description): boolean {
        return this._value === other._value;
    }

    // Optional: toString for convenience
    toString(): string {
        return this._value ?? '';
    }
}