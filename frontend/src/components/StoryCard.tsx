import { Link } from "react-router-dom";
import type { HNStory } from "../types";

const timeAgo = (timestamp?: number) => {
    if (!timestamp) return "";
    const diffMs = Date.now() - timestamp * 1000;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
};

export const StoryCard = ({ story }: { story: HNStory }) => {
    return (
        <article className="card">
            <div className="card-main">
                <Link className="card-title" to={`/story/${story.id}`}>
                    {story.title}
                </Link>
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
                <Link className="btn" to={`/story/${story.id}`}>
                    Open
                </Link>
            </div>
        </article>
    );
};
