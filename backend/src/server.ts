import 'dotenv/config';
import express from 'express';
import { prisma } from './infrastructure/database/prisma';
import { PrismaBookmarkRepository } from './infrastructure/repositories/BookmarkRepository';
import { CreateBookmarkUseCase } from './application/use-cases/CreateBookmarkUseCase';
import { RetrieveBookmarksUseCase } from './application/use-cases/RetrieveBookmarksUseCase';
import { FindBookmarkByIdUseCase } from './application/use-cases/FindBookmarkByIdUseCase';
import { FindBookmarkByUrlUseCase } from './application/use-cases/FindBookmarkByUrlUseCase';
import { DeleteBookmarkUseCase } from './application/use-cases/DeleteBookmarkUseCase';
import { UpdateBookmarkUseCase } from './application/use-cases/UpdateBookmarkUseCase';
import { BookmarkController } from './interface/controllers/BookmarkController';
import { createBookmarkRoutes } from './interface/routes/bookmarkRoutes';
import { setupSwagger } from './infrastructure/config/swagger';

const app = express();
app.use(express.json());

// Setup Swagger
setupSwagger(app);

// Dependency Injection
const bookmarkRepository = new PrismaBookmarkRepository(prisma);
const createBookmarkUseCase = new CreateBookmarkUseCase(bookmarkRepository);
const retrieveBookmarksUseCase = new RetrieveBookmarksUseCase(bookmarkRepository);
const findBookmarkByIdUseCase = new FindBookmarkByIdUseCase(bookmarkRepository);
const findBookmarkByUrlUseCase = new FindBookmarkByUrlUseCase(bookmarkRepository);
const deleteBookmarkUseCase = new DeleteBookmarkUseCase(bookmarkRepository);
const updateBookmarkUseCase = new UpdateBookmarkUseCase(bookmarkRepository);
const bookmarkController = new BookmarkController(createBookmarkUseCase, retrieveBookmarksUseCase, findBookmarkByIdUseCase, findBookmarkByUrlUseCase, deleteBookmarkUseCase, updateBookmarkUseCase);

// Routes
app.use('/api/bookmarks', createBookmarkRoutes(bookmarkController));

// Health Check
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns the status of the API and database connection.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 database:
 *                   type: string
 *       500:
 *         description: Error
 */
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