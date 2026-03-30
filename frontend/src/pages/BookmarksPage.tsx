import { useMemo, useState } from "react";
import { useDeleteBookmark, useBookmarks } from "../api/hooks";
import { Link } from "react-router-dom";

export const BookmarksPage = () => {
    const { data, isLoading, isError } = useBookmarks();
    const deleteBookmark = useDeleteBookmark();
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!data) return [];
        return data.filter((b) => b.title.toLowerCase().includes(query.toLowerCase()));
    }, [data, query]);

    return (
        <div className="page">
            <div className="page-header">
                <h1>Bookmarks</h1>
                <input
                    className="input"
                    placeholder="Search saved stories"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {isLoading && <p>Loading bookmarks…</p>}
            {isError && <p className="error">Failed to load bookmarks.</p>}

            <div className="stack">
                {filtered.map((b) => (
                    <article key={b.id} className="card">
                        <div className="card-main">
                            <Link to={`/story/${b.storyId}`} className="card-title">
                                {b.title}
                            </Link>
                            <p className="card-meta">Saved on {new Date(b.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="card-actions">
                            <button className="btn ghost" onClick={() => deleteBookmark.mutate(b.id)}>
                                Remove
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {!isLoading && filtered.length === 0 && <p className="muted">No bookmarks yet.</p>}
        </div>
    );
};

