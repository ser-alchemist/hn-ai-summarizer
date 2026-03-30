export type HNStory = {
    id: number;
    title: string;
    by?: string;
    score?: number;
    time?: number;
    descendants?: number;
    url?: string;
};

export type HNComment = {
    id: number;
    by?: string;
    text?: string;
    kids?: HNComment[];
};

export type DiscussionSummary = {
    keyPoints: string[];
    sentiment: "positive" | "negative" | "mixed" | "neutral";
    shortSummary: string;
    source: "llm" | "fallback";
};

export type Bookmark = {
    id: number;
    storyId: number;
    title: string;
    createdAt: string;
};

