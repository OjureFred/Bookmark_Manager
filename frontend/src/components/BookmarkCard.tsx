import React, { useState } from 'react';
import axios from 'axios';

interface BookmarkCardProps {
    id: string;
    title: string;
    url: string;
    description: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    onUpdate?: () => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
    id,
    title,
    url,
    description,
    tags,
    createdAt,
    updatedAt,
    onUpdate,
}) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editForm, setEditForm] = useState({
        title,
        url,
        description,
        tags: tags.join(', '),
    });
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEditClick = () => {
        setShowEditModal(true);
        setError(null);
    };

    const handleCancel = () => {
        setShowEditModal(false);
        setEditForm({
            title,
            url,
            description,
            tags: tags.join(', '),
        });
        setError(null);
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            const tagsArray = editForm.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag);

            await axios.put(`http://localhost:3000/api/bookmarks/${id}`, {
                title: editForm.title,
                url: editForm.url,
                description: editForm.description,
                tags: tagsArray,
            });

            setShowEditModal(false);
            if (onUpdate) {
                onUpdate();
            }
        } catch (err) {
            setError('Failed to update bookmark. Please try again.');
            console.error('Error updating bookmark:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await axios.delete(`http://localhost:3000/api/bookmarks/${id}`);
            setShowDeleteConfirm(false);
            if (onUpdate) {
                onUpdate();
            }
        } catch (err) {
            console.error('Error deleting bookmark:', err);
            setShowDeleteConfirm(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div className="bg-white w-full border border-gray-200 rounded-lg gap-6 shadow-md p-4">
                <h3 className="text-blue-600 text-normal font-bold text-gray-900">{title}</h3>
                <p className="text-blue-600 hover:underline">{url}</p>
                <p className="text-sm text-gray-600 mt-2">{description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex justify-between text-gray-400 text-xs mt-4">
                    <p>Created: {createdAt.toLocaleDateString()}</p>
                    <p>Updated: {updatedAt.toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between text-gray-400 text-xs mt-4">
                    <button
                        onClick={handleEditClick}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-2xl font-bold mb-4">Edit Bookmark</h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="edit-title"
                                    value={editForm.title}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, title: e.target.value })
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700">
                                    URL
                                </label>
                                <input
                                    type="url"
                                    id="edit-url"
                                    value={editForm.url}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, url: e.target.value })
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="edit-description"
                                    value={editForm.description}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, description: e.target.value })
                                    }
                                    rows={3}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    id="edit-tags"
                                    value={editForm.tags}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, tags: e.target.value })
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete <span className="font-semibold">{url}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancelDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleteLoading ? 'Deleting...' : 'Yes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookmarkCard;