import mongoose from "mongoose";

const { Schema, model } = mongoose;

const submissionSchema = new Schema(
  {
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("Submission", submissionSchema);
