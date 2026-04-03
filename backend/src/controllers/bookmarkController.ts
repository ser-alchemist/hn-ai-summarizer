import { Request, Response } from "express";
import { prisma } from "../prismaClient";

export const addBookmark = async (req: Request, res: Response) => {
    try {
        const { storyId, title } = req.body;

        const bookmark = await prisma.bookmark.create({
            data: { storyId, title }
        });

        res.json(bookmark);
    } catch (error) {
        res.status(500).json({ error: "Failed to add bookmark" });
    }
};

export const getBookmarks = async (req: Request, res: Response) => {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            orderBy: { createdAt: "desc" }
        });

        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
};

export const deleteBookmark = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        await prisma.bookmark.delete({
            where: { id }
        });

        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete bookmark" });
    }
};