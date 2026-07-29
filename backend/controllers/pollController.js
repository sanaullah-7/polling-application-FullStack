import Comment from "../models/Comment.js";
import Poll from "../models/Poll.js";
import User from "../models/User.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { withCounts } from "../utils/count.js";
import { shapePoll } from "../utils/pollShape.js";

const POP = { path: "creator", select: "name username avatar" };

// bookmark id-set for logged-in users pir ye User ke bookmarks DB se le kar Set bana deta hai 
const bookmarkSet = async (userId) => {
  const me = await User.findById(userId).select("bookmarks");
  return new Set((me?.bookmarks || []).map(String));
};

// create a poll
export const createPoll = async (req, res) => {
  try {
    const { question, type, category } = req.body;
    // validation
    if (!question || !type) {
      return res
        .status(400)
        .json({ message: "Question and type are required" });
    }
//   options
    let options = [];
    if (type === "yesno") {
      options = [
        { text: "Yes", votes: [] },
        { text: "No", votes: [] },
      ];
    } else if (type === "single") {
      const parsed = JSON.parse(req.body.options || "[]");
      options = parsed
        .filter((t) => t && t.trim())
        .map((t) => ({ text: t.trim()}));
      if (options.length < 2) {
        return res
          .status(400)
          .json({ message: "Add at least 2 options" });
      }
    } else if (type === "image") {
      if (!req.files || req.files.length < 2) {
        return res
          .status(400)
          .json({ message: "Add at least 2 images" });
      }
    //   image upload karna
      const urls = await Promise.all(
        req.files.map((f) => uploadToCloudinary(f.buffer))
      );
      options = urls.map((image) => ({ image, text: "" }));
    } else {
      return res.status(400).json({ message: "Invalid poll type" });
    }
    //we sets poll creator userId.
    const poll = await Poll.create({
      creator: req.userId,
      question,
      type,
      category,
      options,
    });

    res.status(201).json({ poll });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// shared list as a helper  function for voted nine feed
const sendList = async (filter, req, res) => {
// find polls by filter,and populate creator
    const polls = await Poll.find(filter)
      .populate(POP)
      .sort({ createdAt: -1 });
    // bookmarks set banata,
    const set = await bookmarkSet(req.userId);
    //  polls ko shape karta aur counts add kar ke return karta hai.
    const shaped = polls.map((poll) => shapePoll(poll, req.userId, set));
    res.json(await withCounts(shaped));
  
};


//  Query params se filter banata (type/category/following) aur sendList ko bhejta hai.
export const listPolls = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type && req.query.type !== "all")
         filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.feed === "following") {
      const me = await User.findById(req.userId).select("following");
      filter.creator = { $in: me?.following || [] };
    }//user following  another  user can filter  by following  filter

    await sendList(filter, req, res);
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sirf current user ke polls laata hai by creator user.id
export const getMyPolls = async (req, res) => {
  try {
    await sendList({ creator: req.userId }, req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Return polls where user has voted 
export const getVotedPolls = async (req, res) => {
  try {
    await sendList({ "votes.user": req.userId }, req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get polls that the current user has bookmarked
export const getBookmarks = async (req, res) => {
  try {
    const me = await User.findById(req.userId).populate({
        path: "bookmarks",
        populate: {path: "creator", select: "name username avatar"}
    });

    const set = new Set((me?.bookmarks || []).map((p)=> String(p._id)));
    const shaped = (me?.bookmarks || []).map((p) =>
         shapePoll(p, req.userId, set));

    res.json(await withCounts(shaped));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get counts of polls grouped by type (e.g. { yesno: 10, single: 5, image: 2 })
export const getTrending = async (req, res) => {
  try {
   const  types = ["single", "yesno", "rating", "image", "open"];
   const counts = await Promise.all(
    types.map((t)=> Poll.countDocuments({type: t}))
   );
    return res.json(types.map((t ,i )=>({
        type: t,
        count : counts[i]
    })));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



// to get the single poll (used by shareable public view)
export const getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(POP);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const creatorId = poll.creator?._id || poll.creator;
    const isCreator = String(creatorId) === String(req.userId);
    const skipView = req.query.noview === "true";

    if (!isCreator && !skipView) {
      poll.views = (poll.views || 0) + 1;
      await poll.save();
    }

    const set = await bookmarkSet(req.userId);
    const [shaped] = await withCounts([shapePoll( poll, req.userId, set)]);
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// to get creator-only stats(no view increment)
export const getPollAnalytics = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(POP);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (String(poll.creator._id) !== String(req.userId))
        return res.status(403).json({
    message:"Not your Poll"
    })

    const shaped = shapePoll(poll, req.userId);
    const comments = await Comment.countDocuments({poll: poll._id});
    res.json({poll:shaped, comments});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
