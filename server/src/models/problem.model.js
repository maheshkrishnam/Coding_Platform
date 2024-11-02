import mongoose from "mongoose";

const { Schema, model } = mongoose;

const problemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["hard", "medium", "easy"],
      index: true,
    },
    problemStatement: {
      type: String,
      required: true,
      trim: true,
    },
    examples: {
      type: String, // image on cloudinary
      required: true,
    },
    tags: [{
      type: String,
      index: true,
    }],
    solvedBy: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    submissions: [{
      type: Schema.Types.ObjectId,
      ref: "Submission",
    }],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    discussions: [{
      type: Schema.Types.ObjectId,
      ref: "Discussion",
    }],
  },
  { timestamps: true }
);

export default model("Problem", problemSchema);
