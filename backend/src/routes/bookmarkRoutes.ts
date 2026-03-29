import { Router } from "express";
import {
    addBookmark,
    getBookmarks,
    deleteBookmark
} from "../controllers/bookmarkController";

const router = Router();

router.post("/", addBookmark);
router.get("/", getBookmarks);
router.delete("/:id", deleteBookmark);

export default router;