import { Router } from 'express';
import { BookmarkController } from '../controllers/BookmarkController';

export const createBookmarkRoutes = (controller: BookmarkController) => {
    const router = Router();
    router.get('/', (req, res) => controller.getAll(req, res));
    router.post('/', (req, res) => controller.create(req, res));
    router.get('/:id', (req, res) => controller.findById(req, res));
    router.get('/search/url/:url', (req, res) => controller.findByUrl(req, res));
    router.delete('/:id', (req, res) => controller.delete(req, res));
    router.put('/:id', (req, res) => controller.update(req, res));
    return router;
};