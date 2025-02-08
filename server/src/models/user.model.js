import mongoose from "mongoose";
import bcrypt from "bcrypt"; // use to hash password
import jwt from "jsonwebtoken"; // generate tokens

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    github: {
      type: String,
      trim: true,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    brach: {
      type: String,
      trim: true,
    },
    avatar: { type: String }, // from cloudinary
    problemSolved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Problem",
      }
    ],
    rating: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 100000,
    },
    streak: {
      type: Number,
      default: 0,
    },
    discussions: [{
      type: Schema.Types.ObjectId,
      ref: "Discussion",
    }],
    activityLogs: [{
      type: Schema.Types.ObjectId,
      ref: "ActivityLog",
    }],
    algorithmsCreated: [{
      type: Schema.Types.ObjectId,
      ref: "Algorithm",
    }],
    refreshToken: { type: String },
  },
  { timestamps: true }
);


// pre must have the access to this so we will be using normal function as arrow function don't have access to this
// middleware :: encrypt the password just before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
  next();
});


// inserting method into userSchema for password checking
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //returns true or false
};


// accessToken
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      fullname: this.fullname,
      email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
};


// refreshToken
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
};

const User = model("User", userSchema);
export default User;