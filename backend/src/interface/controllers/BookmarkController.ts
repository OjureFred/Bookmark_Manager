import { Request, Response } from 'express';
import { CreateBookmarkUseCase } from '../../application/use-cases/CreateBookmarkUseCase';
import { RetrieveBookmarksUseCase } from '../../application/use-cases/RetrieveBookmarksUseCase';
import { FindBookmarkByIdUseCase } from '../../application/use-cases/FindBookmarkByIdUseCase';
import { FindBookmarkByUrlUseCase } from '../../application/use-cases/FindBookmarkByUrlUseCase';
import { DeleteBookmarkUseCase } from '../../application/use-cases/DeleteBookmarkUseCase';
import { UpdateBookmarkUseCase } from '../../application/use-cases/UpdateBookmarkUseCase';

export class BookmarkController {
    constructor(private createBookmarkUseCase: CreateBookmarkUseCase, private retrieveBookmarksUseCase: RetrieveBookmarksUseCase, private findBookmarkByIdUseCase: FindBookmarkByIdUseCase, private findBookmarkByUrlUseCase: FindBookmarkByUrlUseCase, private deleteBookmarkUseCase: DeleteBookmarkUseCase, private updateBookmarkUseCase: UpdateBookmarkUseCase) { }

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

    async getAll(req: Request, res: Response) {
        try {
            const bookmarks = await this.retrieveBookmarksUseCase.execute();
            return res.status(200).json(bookmarks);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findById(req: Request<{ id: string }>, res: Response) {
        try {
            const bookmark = await this.findBookmarkByIdUseCase.execute(req.params.id);
            return res.status(200).json(bookmark);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findByUrl(req: Request<{ url: string }>, res: Response) {
        try {
            const bookmark = await this.findBookmarkByUrlUseCase.execute(req.params.url);
            return res.status(200).json(bookmark);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request<{ id: string }>, res: Response) {
        try {
            await this.deleteBookmarkUseCase.execute(req.params.id);
            return res.status(200).json({ message: 'Bookmark deleted' });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request<{ id: string }>, res: Response) {
        try {
            const bookmark = await this.updateBookmarkUseCase.execute(req.params.id, req.body);
            return res.status(200).json(bookmark);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}