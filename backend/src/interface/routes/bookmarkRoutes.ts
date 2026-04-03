import { Router } from 'express';
import { BookmarkController } from '../controllers/BookmarkController';

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Retrieve all bookmarks
 *     tags: [Bookmarks]
 *     responses:
 *       200:
 *         description: List of bookmarks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 *   post:
 *     summary: Create a new bookmark
 *     tags: [Bookmarks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookmarkDto'
 *     responses:
 *       201:
 *         description: Created bookmark
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       400:
 *         description: Invalid input
 * 
 * /api/bookmarks/{id}:
 *   get:
 *     summary: Get bookmark by ID
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bookmark UUID
 *     responses:
 *       200:
 *         description: Bookmark data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       404:
 *         description: Bookmark not found
 *   put:
 *     summary: Update an existing bookmark
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBookmarkDto'
 *     responses:
 *       200:
 *         description: Updated bookmark
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *   delete:
 *     summary: Delete a bookmark
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmark deleted
 * 
 * /api/bookmarks/search/url/{url}:
 *   get:
 *     summary: Find bookmark by URL
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: Encoded URL to search for
 *     responses:
 *       200:
 *         description: Bookmark found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       404:
 *         description: No bookmark found with that URL
 */
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