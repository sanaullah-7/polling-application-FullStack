import User from "../models/User.js";
import Poll from "../models/Poll.js";
import { shapePoll } from "../utils/pollShape.js";
import { withCounts } from "../utils/count.js";

export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select(
      "name username avatar bio following",
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const [polls, voted, followers, me] = await Promise.all([
      Poll.find({ creator: user._id })
        .populate("creator", "name username avatar")
        .sort("-createdAt"),
      Poll.countDocuments({ "votes.user": user._id }),
      User.countDocuments({ following: user._id }),
      User.findById(req.userId).select("bookmarks following"),
    ]);
    const set = new Set((me?.bookmarks || []).map(String));
    const isFollowing = (me?.following || []).some(
      (id) => String(id) === String(user._id),
    );
    const shaped = await withCounts(
      polls.map((p) => shapePoll(p, req.userId, set)),
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
      },
      isFollowing,
      isMe: String(user._id) === String(req.userId),
      stats: {
        created: polls.length,
        voted,
        followers,
        following: user.following.length,
      },
      polls: shaped,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const targetUser = await User.findOne({
      username: req.params.username,
    }).select("_id");
    if (!targetUser)
      return res.status(404).json({ message: "User not found" });

    const targetId = targetUser._id;
    if (String(targetId) === String(req.userId))
      return res.status(400).json({ message: "You cannot follow yourself" });

    const me = await User.findById(req.userId).select("following");
    if (!me) return res.status(401).json({ message: "Unauthorized" });

    const alreadyFollowing = me.following.some(
      (id) => String(id) === String(targetId),
    );

    if (alreadyFollowing) {
      me.following = me.following.filter(
        (id) => String(id) !== String(targetId),
      );
      await me.save();
      return res.json({ following: false, message: "Unfollowed user" });
    }

    me.following.push(targetId);
    await me.save();
    return res.json({ following: true, message: "Followed user" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFollowLists = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("following")
      .populate("following", "name username avatar");

    if (!user) return res.status(404).json({ message: "User Not Found" });

    const followers = await User.find({ following: user._id }).select(
      "name username avatar bio",
    );

    return res.json({ followers, following: user.following || [] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
