import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // Duration in days
    },
    features: {
      type: [String],
      required: true,
    },
    billingCycle: {
      type: [String],
      enum: ["monthly", "yearly"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Plan = mongoose.model("Plan", planSchema);
