import { Router } from "express";
import { fetchComments } from "../controllers/commentController";

const router = Router();

router.get("/:id", fetchComments);

export default router;