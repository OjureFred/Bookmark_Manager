# 🚀 Bookmark Manager API Documentation

This document provides a comprehensive guide to the Bookmark Manager REST API endpoints.

> [!TIP]
> **Interactive Documentation**: You can also use the **Interactive Swagger UI** at:
> `http://localhost:3000/api-docs` (Requires the server to be running)

---

## 🚦 Base URL
`http://localhost:3000/api/bookmarks`

---

## 📋 Endpoints

### 1. Get All Bookmarks
Retrieve a list of all saved bookmarks.

- **URL:** `/`
- **Method:** `GET`
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** `Array of Bookmark objects`
- **Sample Request:**
  ```bash
  curl -X GET http://localhost:3000/api/bookmarks
  ```

---

### 2. Create New Bookmark
Add a new bookmark to the collection.

- **URL:** `/`
- **Method:** `POST`
- **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `url` | `string` | **Yes** | The full URL of the bookmark (e.g. `https://google.com`). |
  | `title` | `string` | **Yes** | A title for the bookmark. |
  | `description` | `string` | No | A short summary of the bookmark. |
  | `tags` | `string[]` | No | A list of labels (e.g. `['javascript', 'dev']`). |
- **Success Response:**
  - **Code:** `201 Created`
  - **Content:** `Newly created Bookmark object`
- **Error Response:**
  - **Code:** `400 Bad Request`
  - **Content:** `{ "error": "Reason for failure" }`
- **Sample Request:**
  ```json
  {
    "url": "https://expressjs.com",
    "title": "Express JS Documentation",
    "description": "Fast, unopinionated, minimalist web framework for Node.js",
    "tags": ["web", "node", "backend"]
  }
  ```

---

### 3. Get Bookmark by ID
Fetch details for a specific bookmark using its unique UUID.

- **URL:** `/:id`
- **Method:** `GET`
- **URL Params:**
  - `id` (required): The UUID of the bookmark.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** `Bookmark object`
- **Error Response:**
  - **Code:** `400 Bad Request`
  - **Content:** `{ "error": "Bookmark not found" }`

---

### 4. Search Bookmark by URL
Find details of a bookmark by searching for its exact URL.

- **URL:** `/search/url/:url`
- **Method:** `GET`
- **URL Params:**
  - `url` (required): Character-encoded URL of the bookmark.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** `Bookmark object`
- **Note:** It's recommended to encode the URL when passing it as a parameter.

---

### 5. Update Bookmark
Modify an existing bookmark. All fields are optional.

- **URL:** `/:id`
- **Method:** `PUT`
- **Request Body:**
  | Field | Type | Description |
  | :--- | :--- | :--- |
  | `url` | `string` | New URL. |
  | `title` | `string` | New title. |
  | `description` | `string` | New description. |
  | `tags` | `string[]` | Updated list of tags. |
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** `Updated Bookmark object`

---

### 6. Delete Bookmark
Permanently remove a bookmark from the database.

- **URL:** `/:id`
- **Method:** `DELETE`
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** `{ "message": "Bookmark deleted" }`

---

## 🛠️ Data Objects

### **Bookmark Object Schema**
```json
{
  "id": "uuid-v4-string",
  "url": "https://example.com",
  "title": "Example",
  "description": "Description...",
  "tags": ["tag1", "tag2"],
  "createdAt": "ISO-Date-String",
  "updatedAt": "ISO-Date-String"
}
```

---

## 🩺 System Health
Check the server and database connectivity.

- **URL:** `/health`
- **Method:** `GET`
- **Success Response:**
  ```json
  {
    "status": "ok",
    "database": "connected"
  }
  ```
