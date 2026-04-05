//Define types based on the backend API response

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    description: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T = any> {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface ErrorResponse {
    success?: boolean;
    message?: string;
    error?: string;
}