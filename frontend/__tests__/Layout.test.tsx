import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Layout from '../src/components/Layout/Layout';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock child components
vi.mock('../src/components/BookmarkCard', () => ({
    default: ({ title }: any) => <div data-testid="bookmark-card">{title}</div>,
}));

vi.mock('../src/pages/AddBookmark', () => ({
    default: ({ onBack }: any) => <div data-testid="add-bookmark"><button onClick={onBack}>Back</button></div>,
}));

describe('Layout', () => {
    const mockBookmarks = [
        {
            _id: { _value: '1' },
            _url: { _value: 'https://example.com' },
            _title: { _value: 'Test Bookmark' },
            _description: { _value: 'A test bookmark' },
            _tags: { _tags: [{ _name: 'test' }, { _name: 'bookmark' }] },
            _createdAt: { _value: '2023-01-01T00:00:00.000Z' },
            _updatedAt: { _value: '2023-01-02T00:00:00.000Z' },
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockedAxios.get.mockResolvedValue({ data: mockBookmarks });
    });

    it('renders the header and footer', async () => {
        await act(async () => {
            render(<Layout />);
        });

        expect(screen.getByText('Bookmark Manager')).toBeInTheDocument();
        expect(screen.getByText('Bookmark Manager © 2026')).toBeInTheDocument();
    });

    it('renders add and search buttons', async () => {
        await act(async () => {
            render(<Layout />);
        });

        expect(screen.getByRole('button', { name: /add bookmark/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search bookmark/i })).toBeInTheDocument();
    });

    it('fetches and displays bookmarks on mount', async () => {
        render(<Layout />);

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/api/bookmarks');
            expect(screen.getByTestId('bookmark-card')).toBeInTheDocument();
            expect(screen.getByText('Test Bookmark')).toBeInTheDocument();
        });
    });

    it('shows AddBookmark component when add button is clicked', async () => {
        const user = userEvent.setup();
        render(<Layout />);

        const addButton = screen.getByRole('button', { name: /add bookmark/i });
        await user.click(addButton);

        expect(screen.getByTestId('add-bookmark')).toBeInTheDocument();
    });

    it('hides AddBookmark and refetches bookmarks when back is clicked', async () => {
        const user = userEvent.setup();
        render(<Layout />);

        // Show add bookmark
        const addButton = screen.getByRole('button', { name: /add bookmark/i });
        await user.click(addButton);

        // Click back
        const backButton = screen.getByRole('button', { name: /back/i });
        await user.click(backButton);

        // Should refetch bookmarks
        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledTimes(2); // Once on mount, once on back
        });

        // Should show bookmarks again
        expect(screen.getByTestId('bookmark-card')).toBeInTheDocument();
    });

    it('handles fetch error gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

        render(<Layout />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Error fetching bookmarks:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('transforms bookmark data correctly', async () => {
        render(<Layout />);

        await waitFor(() => {
            expect(screen.getByText('Test Bookmark')).toBeInTheDocument();
        });

        // The transformation should work as expected
        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/api/bookmarks');
    });
});