import mongoose from "mongoose";

const bookMarkSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

export const Bookmark = mongoose.model("Bookmark", bookMarkSchema);
