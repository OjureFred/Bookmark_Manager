import { Pool, PoolClient } from 'pg';
import { pool } from '../database/pool';
import { UnitOfWork } from '../../domain/repositories/UnitOfWork';

export class PostgresUnitOfWork implements UnitOfWork {
    private client: PoolClient | null = null;

    constructor(private readonly dbPool: Pool = pool) { }

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