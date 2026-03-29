import { Request, Response } from "express";
import { getTopStories, getItem, summarizeDiscussionForStory } from "../services/hnService";

export const fetchStories = async (req: Request, res: Response) => {
    try {
        const ids: number[] = await getTopStories();

        const stories = await Promise.all(
            ids.map((id: number) => getItem(id))
        );

        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stories" });
    }
};

export const summarizeStoryDiscussion = async (req: Request, res: Response) => {
    try {
        const storyId = Number(req.params.id);

        if (!Number.isFinite(storyId)) {
            return res.status(400).json({ error: "Invalid story id" });
        }

        const summary = await summarizeDiscussionForStory(storyId);
        return res.json(summary);
    } catch (error: any) {
        return res.status(500).json({
            error: "Failed to summarize discussion",
            details: error?.message || "Unknown error"
        });
    }
};
