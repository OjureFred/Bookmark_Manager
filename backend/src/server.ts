import express from 'express';
import { prisma } from './infrastructure/database/prisma';
import { PrismaBookmarkRepository } from './infrastructure/repositories/BookmarkRepository';
import { CreateBookmarkUseCase } from './application/use-cases/CreateBookmarkUseCase';
import { BookmarkController } from './interface/controllers/BookmarkController';
import { createBookmarkRoutes } from './interface/routes/bookmarkRoutes';

const app = express();
app.use(express.json());

// Dependency Injection
const bookmarkRepository = new PrismaBookmarkRepository(prisma);
const createBookmarkUseCase = new CreateBookmarkUseCase(bookmarkRepository);
const bookmarkController = new BookmarkController(createBookmarkUseCase);

// Routes
app.use('/api/bookmarks', createBookmarkRoutes(bookmarkController));

// Health Check
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected' });
    } catch {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

// Graceful Shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});