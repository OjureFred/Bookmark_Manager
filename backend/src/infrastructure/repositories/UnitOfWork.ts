import { Pool, PoolClient } from 'pg';
import { pool } from '../database/pool';
import { IUnitOfWork } from '../../domain/repositories/IUnitOfWork';

export class PostgresUnitOfWork implements IUnitOfWork {
    private client: PoolClient | null = null;

    constructor(private readonly dbPool: Pool = pool) { }

    async execute<T>(work: () => Promise<T>): Promise<T> {
        this.client = await this.dbPool.connect();
        await this.client.query('BEGIN');
        try {
            const result = await work();
            await this.client.query('COMMIT');
            return result;
        } catch (error) {
            await this.client.query('ROLLBACK');
            throw error;
        } finally {
            this.client.release();
            this.client = null;
        }
    }

    async startTransaction(): Promise<void> {
        this.client = await this.dbPool.connect();
        await this.client.query('BEGIN');
    }

    async commit(): Promise<void> {
        if (!this.client) throw new Error('No transaction started');
        await this.client.query('COMMIT');
        this.client.release();
        this.client = null;
    }

    async rollback(): Promise<void> {
        if (!this.client) return;
        await this.client.query('ROLLBACK');
        this.client.release();
        this.client = null;
    }

    getClient(): PoolClient {
        if (!this.client) throw new Error('No transaction started');
        return this.client;
    }
}