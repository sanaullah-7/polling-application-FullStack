import User from "../models/User.js";
import Poll from "../models/Poll.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { generateOtp, OtpExpiry, otpValid } from "../utils/otp.js";
import { sendOtpEmail } from "../config/mailer.js";
import jwt from "jsonwebtoken";

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const clean = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  username: u.username,
  avatar: u.avatar,
  bio: u.bio,
});

const sendVerificationOtp = async (user, reason) => {
  user.otp = generateOtp();
  user.otpExpires = OtpExpiry();
  await user.save();
  await sendOtpEmail(user.email, user.otp, reason);
};

export const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const normalizedUsername = String(username || "").trim();

    if (!name || !normalizedEmail || !normalizedUsername || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const [byEmail, byUsername] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      User.findOne({ username: normalizedUsername }),
    ]);

    if (byEmail?.isVerified) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    if (byUsername && String(byUsername.email) !== String(normalizedEmail)) {
      return res.status(400).json({ message: "This username is already taken" });
    }

    let avatar = "";
    if (req.file) {
      try {
        avatar = await uploadToCloudinary(req.file.buffer);
      } catch (error) {
        console.warn("Avatar upload skipped:", error.message);
      }
    }

    let user = byEmail;

    if (user) {
      user.name = name;
      user.username = normalizedUsername;
      user.password = password;
      if (avatar) user.avatar = avatar;
      await user.save();
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        username: normalizedUsername,
        password,
        avatar,
      });
    }

    try {
      await sendVerificationOtp(user, "verify your Pollify account");
    } catch (error) {
      return res.status(503).json({
        message: error.message,
        needsVerification: true,
        email: user.email,
      });
    }

    return res.status(byEmail ? 200 : 201).json({
      needsVerification: true,
      email: user.email,
      message: byEmail
        ? "Verification code resent. Check your email."
        : "Account created. Check your email for the verification code.",
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      return res.status(400).json({
        message:
          field === "email"
            ? "This email is already registered"
            : "This username is already taken",
      });
    }
    return res.status(500).json({ message: "Registration failed. Try again." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.json({ token: makeToken(user._id), user: clean(user) });
    }

    if (!otpValid(user, otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ token: makeToken(user._id), user: clean(user) });
  } catch (error) {
    return res.status(500).json({ message: "Verification failed. Try again." });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const normalizedEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    await sendVerificationOtp(user, "verify your Pollify account");

    return res.json({ message: "Verification code sent" });
  } catch (error) {
    return res.status(503).json({
      message:
        error.message ||
        "Could not send verification email. Try again shortly.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const normalizedEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const { password } = req.body;

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
        needsVerification: true,
        email: user.email,
      });
    }

    return res.json({
      token: makeToken(user._id),
      user: clean(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed. Try again." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, username, bio } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username && username !== user.username) {
      const taken = await User.findOne({ username });
      if (taken) return res.status(400).json({ message: "Username already taken" });
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
    return res.json({ user: clean(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(req.userId);
    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const [created, voted] = await Promise.all([
      Poll.countDocuments({ creator: req.userId }),
      Poll.countDocuments({ "votes.user": req.userId }),
    ]);

    return res.json({
      user: clean(user),
      stats: {
        created,
        voted,
        bookmarked: (user.bookmarks || []).length,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
