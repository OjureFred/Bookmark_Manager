// domain/value-objects/Url.ts
export class Url {
    private constructor(
        private readonly _value: string,
        private readonly _domain: string,
        private readonly _protocol: string
    ) { }

    static create(url: string): Url {
        // Normalize URL first (remove trailing slashes, ensure protocol)
        const normalized = this.normalize(url);

        // Validate normalized URL format
        if (!this.isValidUrl(normalized)) {
            throw new Error('Invalid URL format');
        }

        const { protocol, domain } = this.parse(normalized);

        return new Url(normalized, domain, protocol);
    }

    private static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    private static normalize(url: string): string {
        // Remove trailing slash
        let normalized = url.trim().replace(/\/$/, '');
        // Ensure https:// if no protocol specified and it looks like a domain
        if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
            if (normalized.includes('.')) {
                normalized = 'https://' + normalized;
            }
        }
        return normalized;
    }

    private static parse(url: string): { protocol: string; domain: string } {
        const urlObj = new URL(url);
        return {
            protocol: urlObj.protocol.replace(':', ''),
            domain: urlObj.hostname
        };
    }

    get value(): string { return this._value; }
    get domain(): string { return this._domain; }
    get protocol(): string { return this._protocol; }

    equals(other: Url): boolean {
        return this._value === other._value;
    }
}