import express from "express";
import cors from "cors";
import storyRoutes from "./routes/storyRoutes";
import commentRoutes from "./routes/commentRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/stories", storyRoutes);
app.use("/comments", commentRoutes);
app.use("/bookmark", bookmarkRoutes);
app.use("/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => {
    res.send("API running...");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});