import { Request, Response } from "express";
import { getStories, getItem, summarizeDiscussionForStory, getStory } from "../services/hnService";

export const fetchStories = async (req: Request, res: Response) => {
    try {
        const type = (req.query.type as string) || "top";
        const ids: number[] = await getStories(type as any);
        const stories = await Promise.all(ids.map((id: number) => getItem(id)));
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

export const fetchStoryById = async (req: Request, res: Response) => {
    try {
        const storyId = Number(req.params.id);
        if (!Number.isFinite(storyId)) {
            return res.status(400).json({ error: "Invalid story id" });
        }
        const story = await getStory(storyId);
        return res.json(story);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch story" });
    }
};
