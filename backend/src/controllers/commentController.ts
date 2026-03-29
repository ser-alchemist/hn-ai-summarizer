import { Request, Response } from "express";
import { getItem, getCommentsTree } from "../services/hnService";

export const fetchComments = async (req: Request, res: Response) => {
    try {
        const storyId = Number(req.params.id);

        const story = await getItem(storyId);

        if (!story || !story.kids) {
            return res.json([]);
        }

        const comments = await getCommentsTree(story.kids);

        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};