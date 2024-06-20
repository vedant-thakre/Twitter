import mongoose from "mongoose";

const hashTagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 15,
      unique: true,
      trim: true,
    },
    tweets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Hashtag = mongoose.model("Hashtag", hashTagSchema);
