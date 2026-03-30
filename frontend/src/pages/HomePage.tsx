import { useMemo, useState } from "react";
import { StoryCard } from "../components/StoryCard";
import { useStories } from "../api/hooks";
import type { StoryFeedType } from "../api/hooks";

const PAGE_SIZE = 10;

const FeedToggle = ({ value, onChange }: { value: StoryFeedType; onChange: (v: StoryFeedType) => void }) => {
    const options: StoryFeedType[] = ["top", "new", "best"];
    return (
        <div className="segmented">
            {options.map((opt) => (
                <button
                    key={opt}
                    className={value === opt ? "segmented-btn active" : "segmented-btn"}
                    onClick={() => onChange(opt)}
                >
                    {opt.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

export const HomePage = () => {
    const [feed, setFeed] = useState<StoryFeedType>("top");
    const [visible, setVisible] = useState(PAGE_SIZE);
    const { data, isLoading, isError, refetch, isFetching } = useStories(feed);

    const stories = useMemo(() => data ?? [], [data]);
    const canLoadMore = visible < stories.length;

    const handleFeedChange = (next: StoryFeedType) => {
        setFeed(next);
        setVisible(PAGE_SIZE);
        refetch();
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Hacker News</h1>
                <FeedToggle value={feed} onChange={handleFeedChange} />
                {isFetching && <span className="muted">Refreshing…</span>}
            </div>

            {isLoading && <p>Loading feed…</p>}
            {isError && <p className="error">Failed to load feed.</p>}

            <div className="stack">
                {stories.slice(0, visible).map((story) => (
                    <StoryCard key={story.id} story={story} />
                ))}
            </div>

            {canLoadMore && (
                <button className="btn ghost" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Load more
                </button>
            )}
        </div>
    );
};
