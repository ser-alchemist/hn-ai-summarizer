import { Request, Response } from "express";
import { getTopStories, getItem } from "../services/hnService";

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