import { uploadToCloudinary } from "../config/cloudinary.js";
import { sendOtpEmail } from "../config/mailer.js";
import Poll from "../models/Poll.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { generateOtp, otpExpiry, otpValid } from "../utils/otp.js";
import jwt from "jsonwebtoken";

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const clean = (u) => ({
  _id: u._id,
  id: u._id,
  name: u.name,
  email: u.email,
  username: u.username,
  avatar: u.avatar,
  bio: u.bio,
});

export const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(400).json({ message: "Email or username already taken" });
    }

    let avatar = "";
    if (req.file) {
      try {
        avatar = await uploadToCloudinary(req.file.buffer);
      } catch (e) {
        console.warn("Avatar upload skipped", e.message);
      }
    }

    const otp = generateOtp();
    await User.create({
      name,
      email,
      username,
      password,
      avatar,
      otp,
      otpExpires: otpExpiry(),
    });

    await sendOtpEmail(email, otp, "verify your Pollify account");

    res.status(201).json({
      needsVerification: true,
      email,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified && !otpValid(user, otp)) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      token: makeToken(user._id),
      user: clean(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.otp = generateOtp();
    user.otpExpires = otpExpiry();
    await user.save();

    await sendOtpEmail(user.email, user.otp, "verify your email");
    res.json({ message: "OTP SENT" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
        needsVerification: true,
        email,
      });
    }

    res.status(200).json({
      token: makeToken(user._id),
      user: clean(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, username, bio } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username && username !== user.username) {
      const taken = await User.findOne({ username });
      if (taken) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (req.file) {
      try {
        user.avatar = await uploadToCloudinary(req.file.buffer);
      } catch (e) {
        console.warn("Avatar upload skipped:", e.message);
      }
    }
    await user.save();
    res.json({ user: clean(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New Password must be atleast 8 char" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: "Current Password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const id = req.userId;
    const myPolls = await Poll.find({ creator: id }).select("_id");
    const pollIds = myPolls.map((p) => p._id);

    await Comment.deleteMany({
      $or: [{ user: id }, { poll: { $in: pollIds } }],
    });

    await Poll.deleteMany({ creator: id });
    await Poll.updateMany({}, { $pull: { votes: { user: id } } });

    await User.findByIdAndDelete(id);

    res.json({ message: "Account Deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    const [created, voted] = await Promise.all([
      Poll.countDocuments({ creator: user._id }),
      Poll.countDocuments({ "votes.user": user._id }),
    ]);

    res.json({
      user: clean(user),
      stats: {
        created,
        voted,
        bookmarked: user.bookmarks.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
