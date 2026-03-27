export interface UnitOfWork {
    commit(): Promise<void>;
    startTransaction(): Promise<void>;
    rollback(): Promise<void>;
    getClient(): any;
}