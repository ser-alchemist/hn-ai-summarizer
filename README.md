# Smart Hacker News Reader

A full-stack Hacker News client that adds AI-powered discussion summaries to comment threads.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Express + TypeScript + Prisma
- Database: PostgreSQL
- AI: Gemini API (configurable model)
- Infra: Docker Compose

## Prerequisites

- Docker
- Docker Compose
- A Gemini API key

## Setup

1. Clone the repository.
2. Create `backend/.env` (or edit it if it already exists).
3. Paste your Gemini API key in `backend/.env`:

```env
GEMINI_API_KEY="your_real_api_key_here"
```

You can also verify these values in `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
GEMINI_MODEL="gemini-3-flash-preview"
```

## Run with Docker

From the project root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- PostgreSQL (host): `localhost:5433`

## Features

- Browse Hacker News stories (top/new/best)
- View story details and nested comments
- Summarize discussion with AI:
  - Key Points
  - Overall Sentiment
  - Short Summary
- Bookmark stories
- Search bookmarked stories

## Notes

- If `GEMINI_API_KEY` is missing, backend falls back to a non-LLM summary path.
- For SPA routing in Docker/Nginx, direct URLs like `/story/:id` are supported by frontend Nginx config.

## What to Improve Next

- Add tests (API + frontend component integration)
- Add robust loading/error UX states for long AI calls
- Improve bookmark filtering/sorting options
- Add request retry and timeout policies for external APIs

