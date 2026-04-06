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
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-blue-600 hover:underline">{url}</p>
            <p className="text-gray-600 mt-2">{description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                        {tag}
                    </span>
                ))}
            </div>
            <div className="text-gray-400 text-xs mt-4">
                <p>Created: {createdAt.toLocaleDateString()}</p>  // Format Date to readable string
                <p>Updated: {updatedAt.toLocaleDateString()}</p>  // Format Date to readable string
            </div>
        </div>
    );
};

export default BookmarkCard;