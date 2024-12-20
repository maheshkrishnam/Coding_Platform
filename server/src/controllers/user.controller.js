import User from "../models/user.model.js";
import uploadOnCloudinary from "../services/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };


  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user data
  const {
    username,
    fullname,
    email,
    github,
    linkedIn,
    college,
    year,
    branch,
    password,
    preferredLanguages
  } = req.body;

  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  };

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError(409, "User with current email or username already exists");
  };

  const avatar = "";

  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    const avatarLocalPath = await req.files?.avatar[0]?.path;
    avatar = await uploadOnCloudinary(avatarLocalPath);
  };


  const user = await User.create({
    username,
    fullname,
    email,
    github,
    linkedIn,
    college,
    year,
    branch,
    avatar: avatar?.url || "",
    password,
    preferredLanguages,
  });

  console.log(user);

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  };

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: createdUser
      },
      "User registered successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password
  } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $and: [{ username }, { email }]
  });

  if (!user) {
    throw new ApiError(404, "user does not exits");
  };

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  };

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  const updatedUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: updatedUser, accessToken, refreshToken
        },
        "User loggedIn Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {},
        "User Logged Out"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  };

  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  };

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh Token expired or used");
  };

  const options = {
    httpOnly: true,
    secure: true
  };

  const { accessToken, refreshToken } = generateAccessAndRefereshTokens(user._id);

  return res
    .send(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken
        },
        "Access token refreshed"
      )
    );
});

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .send(404)
        .json(
          404,
          { message: "User not found" }
        );
    }
    res
      .send(200)
      .json(
        new ApiResponse(
          200,
          {
            user
          }
        )
      );
  } catch (err) {
    res
      .send(500)
      .json(
        new ApiError(
          500,
          {
            message: "Server error",
            error: err.message
          }
        )
      );
  }
};


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};