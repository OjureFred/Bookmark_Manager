import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddBookmark from '../src/pages/AddBookmark';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('AddBookmark', () => {
    const mockOnBack = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the form correctly', () => {
        render(<AddBookmark onBack={mockOnBack} />);

        expect(screen.getByRole('heading', { name: /add bookmark/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add bookmark/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('calls onBack when back button is clicked', async () => {
        const user = userEvent.setup();
        render(<AddBookmark onBack={mockOnBack} />);

        const backButton = screen.getByRole('button', { name: /back/i });
        await user.click(backButton);

        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('submits the form with correct data', async () => {
        const user = userEvent.setup();
        mockedAxios.post.mockResolvedValueOnce({ data: { id: '1' } });

        render(<AddBookmark onBack={mockOnBack} />);

        // Fill out the form
        const urlInput = screen.getByLabelText(/url/i);
        const titleInput = screen.getByLabelText(/title/i);
        const descriptionInput = screen.getByLabelText(/description/i);
        const tagsInput = screen.getByLabelText(/tags/i);

        await user.type(urlInput, 'https://example.com');
        await user.type(titleInput, 'Test Bookmark');
        await user.type(descriptionInput, 'A test description');
        await user.type(tagsInput, 'test, bookmark');

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /add bookmark/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/bookmarks',
                {
                    url: 'https://example.com',
                    title: 'Test Bookmark',
                    description: 'A test description',
                    tags: ['test', 'bookmark'],
                }
            );
            expect(mockOnBack).toHaveBeenCalled();
        });
    });

    it('handles tags with spaces and empty values', async () => {
        const user = userEvent.setup();
        mockedAxios.post.mockResolvedValueOnce({ data: { id: '1' } });

        render(<AddBookmark onBack={mockOnBack} />);

        const urlInput = screen.getByLabelText(/url/i);
        const titleInput = screen.getByLabelText(/title/i);
        const tagsInput = screen.getByLabelText(/tags/i);

        await user.type(urlInput, 'https://example.com');
        await user.type(titleInput, 'Test Bookmark');
        await user.type(tagsInput, ' test , , bookmark ');

        const submitButton = screen.getByRole('button', { name: /add bookmark/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:3000/api/bookmarks',
                expect.objectContaining({
                    tags: ['test', 'bookmark'],
                })
            );
        });
    });

    it('handles form submission error', async () => {
        const user = userEvent.setup();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

        render(<AddBookmark onBack={mockOnBack} />);

        const urlInput = screen.getByLabelText(/url/i);
        const titleInput = screen.getByLabelText(/title/i);

        await user.type(urlInput, 'https://example.com');
        await user.type(titleInput, 'Test Bookmark');

        const submitButton = screen.getByRole('button', { name: /add bookmark/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('Error creating bookmark:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('requires URL and title fields', () => {
        render(<AddBookmark onBack={mockOnBack} />);

        const urlInput = screen.getByLabelText(/url/i);
        const titleInput = screen.getByLabelText(/title/i);

        expect(urlInput).toBeRequired();
        expect(titleInput).toBeRequired();
    });
});