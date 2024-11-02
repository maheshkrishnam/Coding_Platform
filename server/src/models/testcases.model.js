import mongoose from "mongoose";

const { Schema, model } = mongoose;

const testCaseSchema = new Schema(
  {
    input: {
      type: Array,
      required: true,
    },
    output: {
      type: Array,
      required: true,
    },
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default model("TestCase", testCaseSchema);
