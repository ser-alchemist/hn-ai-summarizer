import axios from "axios";
// Lazy-load ESM GoogleGenAI to avoid require/ESM mismatch under CJS output.
let GoogleGenAILoader: any;
const getGoogleGenAI = async () => {
    if (!GoogleGenAILoader) {
        const mod = await import("@google/genai");
        GoogleGenAILoader = mod.GoogleGenAI;
    }
    return GoogleGenAILoader;
};

const BASE_URL = "https://hacker-news.firebaseio.com/v0";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

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
    source: "gemini" | "fallback";
};

const FEED_ENDPOINT: Record<string, string> = {
    top: "topstories",
    new: "newstories",
    best: "beststories"
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

const decodeHtmlEntities = (text: string): string => {
    return text
        .replace(/&#x2F;/gi, "/")
        .replace(/&quot;/gi, '"')
        .replace(/&#x27;/gi, "'")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");
};

const flattenCommentTexts = (nodes: HNCommentNode[]): string[] => {
    const out: string[] = [];
    const walk = (items: HNCommentNode[]) => {
        for (const node of items || []) {
            if (!node) continue;
            const cleaned = decodeHtmlEntities(node.text || "")
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

const stripFence = (raw: string): string => {
    return raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
};

const summarizeWithLLM = async (texts: string[]): Promise<DiscussionSummary> => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("[summarizeWithLLM] GEMINI_API_KEY is missing; using fallback summary.");
        return fallbackSummary(texts);
    }

    const GoogleGenAI = await getGoogleGenAI();
    const ai = new GoogleGenAI({});

    const prompt = [
        "You summarize Hacker News discussions.",
        "Return ONLY valid JSON (no markdown, no extra text) with this exact shape:",
        "{",
        '  "keyPoints": ["string"],',
        '  "sentiment": "positive|negative|mixed|neutral",',
        '  "shortSummary": "string"',
        "}",
        "",
        "Comments:",
        `- ${texts.slice(0, 80).join("\n- ")}`
    ].join("\n");

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
        });

        const rawText = response.text || "{}";
        const jsonText = stripFence(rawText);

        let parsed: any;
        try {
            parsed = JSON.parse(jsonText);
        } catch {
            console.warn("[summarizeWithLLM] Gemini returned non-JSON output; using fallback.");
            return fallbackSummary(texts);
        }

        if (!Array.isArray(parsed.keyPoints) || typeof parsed.shortSummary !== "string" || typeof parsed.sentiment !== "string") {
            console.warn("[summarizeWithLLM] Invalid Gemini JSON shape; using fallback.");
            return fallbackSummary(texts);
        }

        const sentiment: DiscussionSummary["sentiment"] = ["positive", "negative", "mixed", "neutral"].includes(parsed.sentiment)
            ? parsed.sentiment
            : "mixed";

        return {
            keyPoints: parsed.keyPoints
                .filter((v: unknown) => typeof v === "string")
                .slice(0, 8),
            sentiment,
            shortSummary: parsed.shortSummary.trim(),
            source: "gemini"
        };
    } catch (error: any) {
        console.warn("[summarizeWithLLM] Gemini request failed; using fallback.", {
            message: error?.message
        });
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

export const getStories = async (type: "top" | "new" | "best" = "top") => {
    const feed = FEED_ENDPOINT[type] || FEED_ENDPOINT.top;
    const res = await axios.get(`${BASE_URL}/${feed}.json`);
    return res.data.slice(0, 50);
};

export const getStory = async (id: number) => getItem(id);
