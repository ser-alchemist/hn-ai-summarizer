import axios from "axios";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type HNCommentNode = {
    id: number;
    by?: string;
    text?: string;
    kids: HNCommentNode[];
};

type DiscussionSummary = {
    keyPoints: string[];
    sentiment: "positive" | "negative" | "mixed" | "neutral";
    shortSummary: string;
    source: "llm" | "fallback";
};

export const getTopStories = async () => {
    const res = await axios.get(`${BASE_URL}/topstories.json`);
    return res.data.slice(0, 20);
};

export const getItem = async (id: number) => {
    const res = await axios.get(`${BASE_URL}/item/${id}.json`);
    return res.data;
};

export const getCommentsTree = async (ids: number[]): Promise<HNCommentNode[]> => {
    return Promise.all(
        ids.map(async (id) => {
            const item = await getItem(id);

            if (!item) return null as any;

            return {
                id: item.id,
                by: item.by,
                text: item.text,
                kids: item.kids
                    ? await getCommentsTree(item.kids)
                    : []
            };
        })
    );
};

const flattenCommentTexts = (nodes: HNCommentNode[]): string[] => {
    const out: string[] = [];
    const walk = (items: HNCommentNode[]) => {
        for (const node of items || []) {
            if (!node) continue;
            const cleaned = (node.text || "")
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .trim();
            if (cleaned) out.push(cleaned);
            if (node.kids?.length) walk(node.kids);
        }
    };
    walk(nodes);
    return out;
};

const fallbackSummary = (texts: string[]): DiscussionSummary => {
    if (!texts.length) {
        return {
            keyPoints: ["No substantial discussion available."],
            sentiment: "neutral",
            shortSummary: "There are no comments to summarize yet.",
            source: "fallback"
        };
    }

    const top = texts.slice(0, 5).map((t) => t.slice(0, 140));
    return {
        keyPoints: top,
        sentiment: "mixed",
        shortSummary: `Discussion includes ${texts.length} comment snippets with multiple perspectives.`,
        source: "fallback"
    };
};

const summarizeWithLLM = async (texts: string[]): Promise<DiscussionSummary> => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return fallbackSummary(texts);
    }

    const payload = {
        model: OPENAI_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content:
                    "You summarize Hacker News discussions. Return strict JSON with keys: keyPoints (string[]), sentiment (positive|negative|mixed|neutral), shortSummary (string)."
            },
            {
                role: "user",
                content: `Summarize these HN comments:\n\n${texts.slice(0, 80).join("\n- ")}`
            }
        ]
    };

    try {
        const res = await axios.post(
            `${OPENAI_BASE_URL}/chat/completions`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                timeout: 25000
            }
        );

        const content = res.data?.choices?.[0]?.message?.content;
        const parsed = JSON.parse(content || "{}");

        if (!Array.isArray(parsed.keyPoints) || !parsed.shortSummary || !parsed.sentiment) {
            return fallbackSummary(texts);
        }

        const sentiment = ["positive", "negative", "mixed", "neutral"].includes(parsed.sentiment)
            ? parsed.sentiment
            : "mixed";

        return {
            keyPoints: parsed.keyPoints.slice(0, 8),
            sentiment,
            shortSummary: String(parsed.shortSummary),
            source: "llm"
        };
    } catch {
        return fallbackSummary(texts);
    }
};

export const summarizeDiscussionForStory = async (storyId: number): Promise<DiscussionSummary> => {
    const story = await getItem(storyId);
    const commentIds: number[] = story?.kids || [];

    if (!commentIds.length) {
        return fallbackSummary([]);
    }

    const tree = await getCommentsTree(commentIds);
    const texts = flattenCommentTexts(tree).slice(0, 120);

    return summarizeWithLLM(texts);
};
