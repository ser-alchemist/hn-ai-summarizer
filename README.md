# Smart Hacker News Reader

A full-stack Hacker News client that adds AI-powered summaries to comment discussions so users can quickly understand long threads without reading every comment.

## The Problem

Hacker News gets hundreds of stories daily with thousands of comments.
The discussions are often more valuable than the linked article, but reading 200+ comments to find key insights is time-consuming.

## What This Project Builds

### 1) Hacker News Feed
- Fetches stories from Hacker News categories: `top`, `new`, `best`
- Story list displays: title, points, author, time ago, and comment count
- Clicking a story shows full threaded/nested comments
- Incremental loading is used for feed pagination

### 2) Bookmarking
- Save stories to a local database
- View bookmarked stories
- Remove bookmarks

### 3) AI Discussion Summary
- "Summarize Discussion" action on story pages with comments
- Summary output includes:
  - Key Points
  - Overall Sentiment (positive/negative/mixed/neutral)
  - Short Summary

### 4) Search Bookmarks
- Simple search across bookmarked stories

## Technical Stack

- Frontend: React + TypeScript + Vite
- Backend: Express + TypeScript + Prisma
- Database: PostgreSQL
- AI: Gemini API
- Data Source: Hacker News API
- Infrastructure: Docker Compose

## Architecture at a Glance

- `frontend/`: React SPA for feed, story details, comments, bookmarks, and summaries
- `backend/`: Express API for HN fetching, comment tree handling, AI summarization, and bookmark CRUD/search
- `postgres`: persistent storage for bookmarks

## Prerequisites

- Docker
- Docker Compose
- Gemini API key

## Setup

1. Clone this repository.
2. Create or update `backend/.env`.
3. Paste your Gemini API key into `backend/.env`.

```env
GEMINI_API_KEY=your_real_api_key_here
GEMINI_MODEL=gemini-3-flash-preview
```

4. Ensure database URL is set in `backend/.env` (if needed for local non-Docker runs):

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/mydb
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

## Demo Video
https://drive.google.com/file/d/1c2cxoG2E7Xap8GD_COUgvzJBeVJXyjwv/view?usp=sharing

## Notes

- If `GEMINI_API_KEY` is missing, backend falls back to a non-LLM summary path.
- Frontend Nginx config supports SPA routing for direct URLs like `/story/:id`.

## Engineering Decisions

- Kept architecture intentionally simple.
- Used Prisma with Postgres for clear schema and straightforward persistence.
- Prioritized functional UX and clean async handling over visual complexity.

## Tradeoffs

- No authentication or multi-user support (intentionally out of scope).
- No CI/CD or deployment pipeline in this submission.
- Limited advanced resiliency (retry/backoff/caching) for external dependencies.
- No full automated test suite in current scope.

## Assumptions

- Single-user local usage is sufficient for this assignment.
- Hacker News API and Gemini API availability are acceptable for demo use.

## What I'd Improve with More Time

- Add backend integration tests and frontend component tests.
- Improve prompt strategy/chunking for very large comment trees.
- Add stronger timeout/retry/caching policy for HN + LLM requests.
- Improve bookmark filtering/sorting UX.
