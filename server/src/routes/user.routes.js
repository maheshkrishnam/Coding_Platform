import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken, getUserProfile, updateUserProfile, getUserProfileByUsername } from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = Router();

// upload is a middleware to send image
userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    }
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);

// secured route by options
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("refresh-token").post(refreshAccessToken);
userRouter.put("/update-profile", verifyJWT, updateUserProfile);
userRouter.get("/me", verifyJWT, getUserProfile);
userRouter.get("/profile/:username", getUserProfileByUsername);

export default userRouter;