import mongoose from "mongoose";

const { Schema, model } = mongoose;

const algorithmSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    code: [{
      type: String,
      required: true,
    }],
    timeComplexity: {
      type: String,
      required: true,
    },
    spaceComplexity: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model("Algorithm", algorithmSchema);
