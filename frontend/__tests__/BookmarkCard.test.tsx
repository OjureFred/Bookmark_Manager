import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookmarkCard from '../src/components/BookmarkCard';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('BookmarkCard', () => {
    const mockBookmark = {
        id: '1',
        title: 'Test Bookmark',
        url: 'https://example.com',
        description: 'A test bookmark',
        tags: ['test', 'bookmark'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
    };

    const mockOnUpdate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders bookmark information correctly', () => {
        render(<BookmarkCard {...mockBookmark} onUpdate={mockOnUpdate} />);

        expect(screen.getByText('Test Bookmark')).toBeInTheDocument();
        expect(screen.getByText('https://example.com')).toBeInTheDocument();
        expect(screen.getByText('A test bookmark')).toBeInTheDocument();
        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('bookmark')).toBeInTheDocument();
        expect(screen.getByText(/Created:/)).toBeInTheDocument();
        expect(screen.getByText(/Updated:/)).toBeInTheDocument();
    });

    it('opens edit modal when edit button is clicked', async () => {
        const user = userEvent.setup();
        render(<BookmarkCard {...mockBookmark} onUpdate={mockOnUpdate} />);

        const editButton = screen.getByRole('button', { name: /edit/i });
        await user.click(editButton);

        expect(screen.getByText('Edit Bookmark')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Bookmark')).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('A test bookmark')).toBeInTheDocument();
        expect(screen.getByDisplayValue('test, bookmark')).toBeInTheDocument();
    });

    it('opens delete confirmation modal when delete button is clicked', async () => {
        const user = userEvent.setup();
        render(<BookmarkCard {...mockBookmark} onUpdate={mockOnUpdate} />);

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        await user.click(deleteButton);

        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    });

    it('calls onUpdate after successful edit', async () => {
        const user = userEvent.setup();
        mockedAxios.put.mockResolvedValueOnce({ data: {} });

        render(<BookmarkCard {...mockBookmark} onUpdate={mockOnUpdate} />);

        // Open edit modal
        const editButton = screen.getByRole('button', { name: /edit/i });
        await user.click(editButton);

        // Change title
        const titleInput = screen.getByLabelText(/title/i);
        await user.clear(titleInput);
        await user.type(titleInput, 'Updated Title');

        // Save
        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        await waitFor(() => {
            expect(mockedAxios.put).toHaveBeenCalledWith(
                'http://localhost:3000/api/bookmarks/1',
                expect.objectContaining({
                    title: 'Updated Title',
                    url: 'https://example.com',
                    description: 'A test bookmark',
                    tags: ['test', 'bookmark'],
                })
            );
            expect(mockOnUpdate).toHaveBeenCalled();
        });
    });

    it('calls onUpdate after successful delete', async () => {
        const user = userEvent.setup();
        mockedAxios.delete.mockResolvedValueOnce({ data: {} });

        render(<BookmarkCard {...mockBookmark} onUpdate={mockOnUpdate} />);

        // Open delete modal
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        await user.click(deleteButton);

        // Confirm delete
        const confirmButton = screen.getByRole('button', { name: /yes/i });
        await user.click(confirmButton);

        await waitFor(() => {
            expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:3000/api/bookmarks/1');
            expect(mockOnUpdate).toHaveBeenCalled();
        });
    });

    it('shows error message on edit failure', async () => {
        const user = userEvent.setup();
        mockedAxios.put.mockRejectedValueOnce(new Error('Network error'));

        render(<BookmarkCard {...mockBookmark} onUpdate={mockOnUpdate} />);

        // Open edit modal
        const editButton = screen.getByRole('button', { name: /edit/i });
        await user.click(editButton);

        // Save
        const saveButton = screen.getByRole('button', { name: /save/i });
        await user.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to update bookmark. Please try again.')).toBeInTheDocument();
        });
    });

    it('cancels edit and resets form', async () => {
        const user = userEvent.setup();
        render(<BookmarkCard {...mockBookmark} onUpdate={mockOnUpdate} />);

        // Open edit modal
        const editButton = screen.getByRole('button', { name: /edit/i });
        await user.click(editButton);

        // Change title
        const titleInput = screen.getByLabelText(/title/i);
        await user.clear(titleInput);
        await user.type(titleInput, 'Changed Title');

        // Cancel
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        // Re-open modal
        await user.click(editButton);

        // Check if form is reset
        expect(screen.getByDisplayValue('Test Bookmark')).toBeInTheDocument();
    });
});