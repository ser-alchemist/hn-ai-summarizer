import { Router } from "express";
import { fetchStories } from "../controllers/storyController";

const router = Router();

router.get("/", fetchStories);

export default router;