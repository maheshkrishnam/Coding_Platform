import mongoose from "mongoose";

const { Schema, model } = mongoose;

const learningResourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    code: [{
      type: String,  // image from cloudinary
      required: true,
    }],
    tags: [{
      type: String,
      index: true
    }],
    difficultyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    relatedAlgorithms: [{
      type: Schema.Types.ObjectId,
      ref: "Algorithm"
    }],
  },
  { timestamps: true }
);

export default model("LearningResource", learningResourceSchema);
