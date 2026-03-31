import { Router } from 'express';
import { BookmarkController } from '../controllers/BookmarkController';

export const createBookmarkRoutes = (controller: BookmarkController) => {
    const router = Router();
    router.get('/', (req, res) => controller.getAll(req, res));
    router.post('/', (req, res) => controller.create(req, res));
    return router;
};