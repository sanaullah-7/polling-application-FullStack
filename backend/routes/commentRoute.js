import express from "express";
import { protect } from "../middleware/auth.js";
import { addComment, deleteComment, getCommets } from "../controllers/commnetController.js";

const commentRouter  = express.Router();
commentRouter.use(protect);

commentRouter.get("/:pollId", getCommets);
commentRouter.post("/:pollId", addComment);

commentRouter.delete("/:commentId", deleteComment);

export default commentRouter;