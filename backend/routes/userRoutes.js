import express from "express";
import { protect } from "../middleware/auth.js";
import { getFollowLists, getPublicProfile, toggleFollow } from "../controllers/userController.js";


const userRouter = express.Router();
userRouter.use(protect);

userRouter.get("/:username/followers", getFollowLists);
userRouter.post("/:username/follow", toggleFollow);
userRouter.get("/:username", getPublicProfile);

export default userRouter;
