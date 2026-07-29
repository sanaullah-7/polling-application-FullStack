import User from "../models/User.js";
import { sendOtpEmail } from "../config/mailer.js";
import { generateOtp, OtpExpiry, otpValid } from "../utils/otp.js";

export const forgotPassword = async (req, res) => {
  try {
    const normalizedEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = OtpExpiry();
    await user.save();

    await sendOtpEmail(user.email, otp, "reset your password");

    return res.json({ message: "Password reset code sent to your email" });
  } catch (error) {
    return res.status(503).json({
      message:
        error.message ||
        "Could not send reset email. Try again shortly.",
    });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    const normalizedEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const { otp } = req.body;

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!otpValid(user, otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    return res.json({ message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ message: "Verification failed. Try again." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const normalizedEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const { otp, newPassword } = req.body;

    if (!normalizedEmail || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!otpValid(user, otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Password reset failed. Try again." });
  }
};
