# 📌 BookMark Manager

A full-stack **Bookmark Manager** application built with a clean, domain-driven architecture. The backend is powered by **Node.js**, **Express**, and **TypeScript**, following Domain-Driven Design (DDD) principles with clearly separated layers.

---

## 🗂️ Project Structure

```
BookMark_Manager/
├── backend/                  # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── domain/           # Core business logic (DDD)
│   │   │   ├── aggregates/
│   │   │   │   └── Bookmark.ts        # Bookmark aggregate root
│   │   │   └── value-objects/
│   │   │       ├── BookmarkId.ts      # UUID-based identifier
│   │   │       ├── BookmarkDate.ts    # Date value object
│   │   │       ├── Description.ts     # Optional description (max 500 chars)
│   │   │       ├── Tag.ts             # Individual tag
│   │   │       ├── Tags.ts            # Collection of tags
│   │   │       ├── Title.ts           # Bookmark title
│   │   │       └── Url.ts             # URL with domain extraction
│   │   ├── application/      # Use cases / application services (WIP)
│   │   ├── infrastructure/   # DB, external services (WIP)
│   │   ├── presentation/     # Controllers / routes (WIP)
│   │   └── server.ts         # Express server entry point
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Frontend (coming soon)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BookMark_Manager
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**

   The `.env` file in the `backend/` folder already contains defaults:
   ```env
   PORT=3000
   ```
   Adjust as needed.

---

## 🛠️ Running the Backend

### Development mode (with hot reload via nodemon)
```bash
cd backend
npm run dev
```

The server will start at: **http://localhost:3000**

### Production build
```bash
cd backend
npm run build      # Compiles TypeScript to dist/
npm run start      # Runs the compiled output
```

### Type-check only (no output files)
```bash
cd backend
npx tsc --noEmit
```

---

## 🔌 API Endpoints

The API is accessible under the `/api/bookmarks` prefix.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/health` | Check system and database status |
| **GET** | `/api/bookmarks` | Retrieve all bookmarks |
| **POST** | `/api/bookmarks` | Create a new bookmark |
| **GET** | `/api/bookmarks/:id` | Get bookmark details by ID |
| **GET** | `/api/bookmarks/search/url/:url` | Find a bookmark by its URL |
| **PUT** | `/api/bookmarks/:id` | Update an existing bookmark |
| **DELETE** | `/api/bookmarks/:id` | Remove a bookmark |

> For detailed request/response schemas, please refer to the [Full API Documentation](./backend/API_DOCUMENTATION.md).

---

## 🏛️ Architecture

This project follows **Domain-Driven Design (DDD)** with a layered architecture:

| Layer            | Responsibility                                        |
|------------------|-------------------------------------------------------|
| **Domain**       | Core business rules — entities, value objects, aggregates |
| **Application**  | Use cases that orchestrate domain logic               |
| **Infrastructure** | Data persistence, external APIs, repositories      |
| **Presentation** | HTTP controllers, request/response handling          |

### Domain Value Objects

Value objects are immutable and self-validating:

- **`BookmarkId`** — UUID v4 identifier, validated on creation
- **`Url`** — Validates URL format; exposes the domain (hostname)
- **`Title`** — Non-empty string title
- **`Description`** — Optional text, max 500 characters
- **`Tag`** / **`Tags`** — Individual tag and tag collection management
- **`BookmarkDate`** — Wraps `Date`; supports comparison and ISO formatting

---

## 🧰 Tech Stack

| Area        | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js                           |
| Language    | TypeScript 5.x                    |
| Framework   | Express 5.x                       |
| ID Gen      | uuid (v4)                         |
| Env config  | dotenv                            |
| CORS        | cors                              |
| Dev tooling | nodemon, ts-node                  |

---

## 📋 Scripts Reference

Run these from the `backend/` directory:

| Script          | Command             | Description                        |
|-----------------|---------------------|------------------------------------|
| Start dev server | `npm run dev`      | Hot-reload dev server via nodemon  |
| Build           | `npm run build`     | Compile TypeScript → `dist/`       |
| Start prod      | `npm run start`     | Run compiled production build      |
| Test            | `npm run test`      | Run unit tests                     |
| Coverage        | `npm run coverage`  | Run unit tests with coverage       |

---

## 📖 API Documentation

Detailed information about the API endpoints, request bodies, and response formats can be found in:
👉 [**Backend API Documentation**](./backend/API_DOCUMENTATION.md)

---


## 📄 License

ISC
