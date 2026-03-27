import { Request, Response } from 'express';
import { CreateBookmarkUseCase } from '../../application/use-cases/CreateBookmarkUseCase';

export class BookmarkController {
    constructor(private createBookmarkUseCase: CreateBookmarkUseCase) { }

    async create(req: Request, res: Response) {
        try {
            const dto = {
                url: req.body.url,
                title: req.body.title,
                description: req.body.description,
                tags: req.body.tags || [],
            };

            const bookmark = await this.createBookmarkUseCase.execute(dto);

            return res.status(201).json({
                id: bookmark.id,
                url: bookmark.url,
                title: bookmark.title,
                description: bookmark.description,
                tags: bookmark.tags,
                createdAt: bookmark.createdAt,
            });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}