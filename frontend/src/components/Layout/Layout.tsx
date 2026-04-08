import React from 'react';
import BookmarkCard from '../BookmarkCard';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import type { Bookmark } from '../../types';
import AddBookmark from '../../pages/AddBookmark';


const API_URL = 'http://localhost:3000/api/bookmarks';

const Layout: React.FC = () => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [showAddBookmark, setShowAddBookmark] = useState(false);

    const fetchBookmarks = async () => {
        try {
            const response = await axios.get(API_URL);
            // Transform the nested response to match Bookmark type
            const transformedBookmarks: Bookmark[] = response.data.map((item: any) => ({
                id: item._id._value,
                url: item._url._value,
                title: item._title._value,
                description: item._description._value,
                tags: item._tags._tags.map((tag: any) => tag._name),
                createdAt: new Date(item._createdAt._value),
                updatedAt: new Date(item._updatedAt._value),
            }));
            setBookmarks(transformedBookmarks);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const handleAddBookmark = () => {
        setShowAddBookmark(true);
    };

    const handleSearchBookmark = () => {
        console.log('Search Bookmark');
    };

    console.log(bookmarks);

    return (
        <div className="min-h-screen bg-gray-150">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Bookmark Manager</h1>
                    </div>
                </div>
                <div className=" flex justify-between w-full border border-gray-200 rounded-lg gap-6 shadow-md p-4">
                    <button onClick={handleAddBookmark} className="bg-blue-600 text-white px-2 py-1 rounded-xl text-sm">Add Bookmark</button>
                    <button onClick={handleSearchBookmark} className='bg-blue-600 text-white px-2 py-1 rounded-xl text-sm'>Search Bookmark</button>
                </div>
            </header>
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {showAddBookmark ? (
                    <AddBookmark onBack={() => { setShowAddBookmark(false); fetchBookmarks(); }} />
                ) : (
                    <div className="w-full border border-gray-200 rounded-lg shadow-md p-4 text-left gap-6">
                        {bookmarks.map((bookmark) => (
                            <BookmarkCard
                                key={bookmark.id}
                                id={bookmark.id}
                                title={bookmark.title}
                                url={bookmark.url}
                                description={bookmark.description}
                                tags={bookmark.tags}
                                createdAt={bookmark.createdAt}
                                updatedAt={bookmark.updatedAt}
                                onUpdate={fetchBookmarks}
                            />
                        ))}
                    </div>
                )}
            </main>
            {/* Footer */}
            <footer className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <p>Bookmark Manager &copy; 2026</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Layout