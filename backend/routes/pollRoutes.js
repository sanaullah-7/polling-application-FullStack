import express from "express";
import { protect } from "../middleware/auth.js";
import { createPoll, getBookmarks, getMyPolls, getPoll, getPollAnalytics, getTrending, getVotedPolls, listPolls } from "../controllers/pollController.js";
import { upload } from "../config/cloudinary.js";
import { closePoll, deletePoll, removeVot, toggleBookmark, updatePoll, votePoll } from "../controllers/voteController.js";

const pollRouter = express.Router();

pollRouter.use(protect);
 
pollRouter.get("/",listPolls)
pollRouter.post("/", upload.array("images", 4), createPoll)
pollRouter.get("/mine",getMyPolls)
pollRouter.get("/voted",getVotedPolls)
pollRouter.get("/bookmarks",getBookmarks)
pollRouter.get("/trending",getTrending)

pollRouter.get("/:id/vote",getPollAnalytics)
pollRouter.get("/:id",getPoll);

// vote
pollRouter.post("/:id/vote",votePoll);
pollRouter.delete("/:id/vote",removeVot);
pollRouter.patch("/:id/close", closePoll);

pollRouter.patch("/:id",updatePoll);
pollRouter.delete("/:id",deletePoll);
pollRouter.post("/:id/bookmarks",toggleBookmark);

export default pollRouter;




