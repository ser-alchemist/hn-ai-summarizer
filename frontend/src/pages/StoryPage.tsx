import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useAddBookmark,
    useBookmarks,
    useComments,
    useDeleteBookmark,
    useStory,
    useSummarize
} from "../api/hooks";
import { CommentTree } from "../components/CommentTree";
import { SummaryCard } from "../components/SummaryCard";

const timeAgo = (timestamp?: number) => {
    if (!timestamp) return "";
    const diffMs = Date.now() - timestamp * 1000;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
};

export const StoryPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const storyId = Number(params.id);

    const { data: story, isLoading: storyLoading, isError: storyError } = useStory(storyId);
    const { data: comments, isLoading: commentsLoading } = useComments(storyId);
    const summarize = useSummarize(storyId);
    const { data: bookmarks } = useBookmarks();
    const addBookmark = useAddBookmark();
    const deleteBookmark = useDeleteBookmark();

    const existingBookmark = useMemo(
        () => bookmarks?.find((b) => b.storyId === storyId),
        [bookmarks, storyId]
    );

    if (!Number.isFinite(storyId)) {
        return <p className="error">Invalid story id.</p>;
    }

    const handleBookmark = () => {
        if (!story) return;
        if (existingBookmark) {
            deleteBookmark.mutate(existingBookmark.id);
        } else {
            addBookmark.mutate({ storyId: story.id, title: story.title });
        }
    };

    return (
        <div className="page">
            <button className="btn ghost" onClick={() => navigate(-1)}>
                ← Back
            </button>

            {storyLoading && <p>Loading story…</p>}
            {storyError && <p className="error">Failed to load story.</p>}

            {story && (
                <section className="card">
                    <div className="card-main">
                        <h1 className="card-title">{story.title}</h1>
                        <p className="card-meta">
                            {story.score ? `${story.score} points` : ""}
                            {story.by ? ` • by ${story.by}` : ""}
                            {story.time ? ` • ${timeAgo(story.time)}` : ""}
                            {typeof story.descendants === "number" ? ` • ${story.descendants} comments` : ""}
                        </p>
                        {story.url && (
                            <a className="card-link" href={story.url} target="_blank" rel="noreferrer">
                                {story.url}
                            </a>
                        )}
                    </div>
                    <div className="card-actions">
                        <button className="btn" onClick={handleBookmark} disabled={addBookmark.isPending || deleteBookmark.isPending}>
                            {existingBookmark ? "Remove bookmark" : "Save bookmark"}
                        </button>
                    </div>
                </section>
            )}

            <section className="card column">
                <div className="card-header">
                    {summarize.data && <h2>Discussion summary</h2>}

                    {!summarize.data &&
                    <button className="btn" onClick={() => summarize.mutate()} disabled={summarize.isPending}>
                        {summarize.isPending ? "Summarizing…" : "Summarize Discussion"}
                    </button>}
                </div>
                {summarize.isError && <p className="error">Failed to summarize.</p>}
                {summarize.data && <SummaryCard summary={summarize.data} />}
                {!summarize.data && <p className="muted">Click 'Summarize Discussion' to get key points.</p>}
            </section>

            <section className="card column">
                <div className="card-header">
                    <h2>Comments</h2>
                    {commentsLoading && <span className="muted">Loading…</span>}
                </div>
                {comments && <CommentTree comments={comments} />}
            </section>
        </div>
    );
};
