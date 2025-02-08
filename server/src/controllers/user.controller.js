import User from "../models/user.model.js";
import uploadOnCloudinary from "../services/cloudinary.service.js";
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
    $or: [{ username }, { email }]
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

const getUserProfile = asyncHandler(async (req, res) => {
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
});

const updateUserProfile = async (req, res) => {
  try {
    const { fullname, username, email, college, year, rank, github, linkedIn, password } = req.body;
    const userId = req.user.id; // Get the user ID from the authenticated token

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user fields if provided
    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (email) user.email = email;
    if (college) user.college = college;
    if (year) user.year = year;
    if (rank) user.rank = rank;
    if (github) user.github = github;
    if (linkedIn) user.linkedIn = linkedIn;

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user
    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Function to get a custom user's profile by username
const getUserProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateUserProfile,
  getUserProfile,
  getUserProfileByUsername
};