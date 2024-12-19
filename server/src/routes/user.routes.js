import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
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

export default userRouter;