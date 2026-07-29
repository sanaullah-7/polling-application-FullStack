import express from "express";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  updateProfile,
  changePassword,
  deleteAccount,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";
import { forgotPassword, resetPassword, verifyResetOtp } from "../controllers/passwordController.js";

const authRouter = express.Router();

// public routes
authRouter.post("/register", upload.single("image"), register); // create new user and send OTP
authRouter.post("/verify-otp", verifyOtp); // verify email OTP
authRouter.post("/resend-otp", resendOtp); // resend OTP to user email
authRouter.post("/login", login); // login user and return JWT token
authRouter.post("/forget-password", forgotPassword); // request password reset OTP
authRouter.post("/verify-reset-otp", verifyResetOtp); // check password reset OTP
authRouter.post("/reset-password", resetPassword); // reset password after OTP verification

// protected routes - require valid token
authRouter.get("/me", protect, getMe); // get logged-in user profile
authRouter.patch("/profile", protect, upload.single("image"), updateProfile); // update user profile fields
authRouter.put("/password", protect, changePassword); // change user password
authRouter.delete("/account", protect, deleteAccount); // delete logged-in user account

export default authRouter;