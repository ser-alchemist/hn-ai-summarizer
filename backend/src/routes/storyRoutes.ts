import { Router } from "express";
import { fetchStories, summarizeStoryDiscussion, fetchStoryById } from "../controllers/storyController";

const router = Router();

router.get("/", fetchStories);
router.post("/:id/summarize", summarizeStoryDiscussion);
router.get("/:id", fetchStoryById);

export default router;