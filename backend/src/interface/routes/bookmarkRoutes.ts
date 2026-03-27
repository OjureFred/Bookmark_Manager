import { Router } from 'express';
import { BookmarkController } from '../controllers/BookmarkController';

export const createBookmarkRoutes = (controller: BookmarkController) => {
    const router = Router();
    router.post('/', (req, res) => controller.create(req, res));
    return router;
};