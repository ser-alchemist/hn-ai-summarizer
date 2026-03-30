import type { HNComment } from "../types";
import { stripHtml } from "../api/client";

const CommentNode = ({ comment }: { comment: HNComment }) => {
    return (
        <li className="comment">
            <p className="comment-meta">{comment.by || "anon"}</p>
            <p className="comment-text">{stripHtml(comment.text)}</p>
            {comment.kids && comment.kids.length > 0 && (
                <ul className="comment-children">
                    {comment.kids.map((kid) => (
                        <CommentNode key={kid.id} comment={kid} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export const CommentTree = ({ comments }: { comments: HNComment[] }) => {
    if (!comments?.length) return <p className="muted">No comments yet.</p>;
    return (
        <ul className="comment-list">
            {comments.map((c) => (
                <CommentNode key={c.id} comment={c} />
            ))}
        </ul>
    );
};
