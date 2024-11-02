import mongoose from "mongoose";

const { Schema, model } = mongoose;

const discussionSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
  },
  { timestamps: true }
);

export default model("Discussion", discussionSchema);
