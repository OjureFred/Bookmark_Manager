import React from 'react';

interface BookmarkCardProps {
    title: string;
    url: string;
    description: string;
    tags: string[];
    createdAt: Date;  // Changed from string to Date
    updatedAt: Date;  // Changed from string to Date
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
    title,
    url,
    description,
    tags,
    createdAt,
    updatedAt
}) => {
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
                    <button className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Edit</button>
                    <button className="bg-red-600 text-white px-2 py-1 rounded text-sm">Delete</button>
                </div>
            </div>
        </>
    );
};

export default BookmarkCard;