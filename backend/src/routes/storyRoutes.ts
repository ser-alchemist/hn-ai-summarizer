import { Router } from "express";
import { fetchStories, summarizeStoryDiscussion } from "../controllers/storyController";

const router = Router();

router.get("/", fetchStories);
router.post("/:id/summarize", summarizeStoryDiscussion);

export default router;