import Poll from "../models/Poll.js";
import Comment from "../models/Comment.js";
import { notify } from "./notificationController.js";

export const getCommets = async (req, res) => {
  try {
    const comments = await Comment.find({ poll: req.params.pollId })
      .populate("user", "name username avatar")
      .sort("-createdAt");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const text = (req.body.text || "").trim();
    if (!text)
      return res.status(400).json({ message: "Commnet cannot be empty" });

    const comment = await Comment.create({
      poll: req.params.pollId,
      user: req.userId,
      parent: req.body.parent || null,
      text,
    });

    const populated = await comment.populate("user", "name username avatar");
    const poll = await Poll.findById(req.params.pollId).select("creator");
    if (poll && String(poll.creator) !== String(req.userId)) {
      await notify({
        user: poll.creator,
        actor: req.userId,
        poll: poll._id,
        type: "comment",
      });
    }
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (String(comment.user) !== String(req.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Comment.deleteMany({
      $or: [{ _id: comment._id }, { parent: comment._id }],
    });
    res.json({ message: "Comment removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
