import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { shapePoll } from "./pollShape.js";

// to get the count for total users saved booknarks and commnets counting
async function countsFor(pollIds) {
    // Agar pollIds khaali hai to turant khaali objects return karo — commentMap aur saveMap.
    if(!pollIds.length) return {commentMap: {}, saveMap: {}};
    
  const [comments, saves] = await Promise.all([
    Comment.aggregate([
        // sirf un comments ko chunna jinka poll id given list mein ho.
      { $match: { poll: { $in: pollIds } } },
      { $group: { _id: "$poll", n: { $sum: 1 } } },//her poll ke liye comments count bana raha hai.
    ]),
    User.aggregate([
      { $match: { bookmarks: { $in: pollIds } } },
      { $unwind: "$bookmarks" },
      { $match: { bookmarks: { $in: pollIds } } },
      { $group: { _id: "$bookmarks", n: { $sum: 1 } } },//group by bookmark id and count how many users saved that poll.
    ]),
  ]);
  const commentMap = {};
  const saveMap = {};
  comments.forEach((c) => (commentMap[String(c._id)] = c.n));
  saves.forEach((s) => (saveMap[String(s._id)] = s.n));
  return {commentMap, saveMap};
}

// to show commnet and saved on the poll
export async function withCounts(shapedPolls) {
  const { commentMap, saveMap } = await countsFor(
    shapedPolls.map((p) => p._id)
  );

  return shapedPolls.map((p) => ({
    ...p,
    commentCount: commentMap[String(p._id)] || 0,
    saveCount: saveMap[String(p._id)] || 0,
  }));
}