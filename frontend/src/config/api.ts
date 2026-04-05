//API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const API_ENDPOINTS = {
    BOOKMARKS: {
        GET_ALL: `${API_BASE_URL}/bookmarks`,
        GET_BY_ID: `${API_BASE_URL}/bookmarks/:id`,
        CREATE: `${API_BASE_URL}/bookmarks`,
        UPDATE: `${API_BASE_URL}/bookmarks/:id`,
        DELETE: `${API_BASE_URL}/bookmarks/:id`,
    },
}

export default API_BASE_URL;
