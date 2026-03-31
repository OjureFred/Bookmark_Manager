import { IUnitOfWork } from "../../domain/repositories/IUnitOfWork";
import { prisma } from "./prisma";

export class PrismaUnitOfWork implements IUnitOfWork {
    async execute<T>(work: () => Promise<T>): Promise<T> {
        return await prisma.$transaction(async (tx) => {
            return await work();
        });
    }
}