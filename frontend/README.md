# Smart HN Reader – Frontend

React + Vite single-page app consuming the Express backend to browse Hacker News stories, summarize comment threads, and manage bookmarks.

## Commands
```bash
npm install
npm run dev    # starts Vite dev server (defaults to http://localhost:5173)
npm run build  # type-check and production build
```

## Environment
- `VITE_API_BASE_URL` (optional): override backend base URL (defaults to `http://localhost:3000`).

## Features
- Top/New/Best feed selector with load-more pagination.
- Story detail with nested comments and "Summarize" action.
- Bookmark add/remove, plus saved list with search.
- React Query for caching/loading states; simple utility CSS.
