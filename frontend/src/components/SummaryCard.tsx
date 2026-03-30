import type { DiscussionSummary } from "../types";

export const SummaryCard = ({ summary }: { summary: DiscussionSummary }) => {
    return (
        <div className="summary">
            <div className="summary-row">
                <span className="pill">Sentiment: {summary.sentiment}</span>
                <span className="pill">Source: {summary.source}</span>
            </div>
            <p className="summary-text">{summary.shortSummary}</p>
            <ul className="summary-list">
                {summary.keyPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                ))}
            </ul>
        </div>
    );
};
