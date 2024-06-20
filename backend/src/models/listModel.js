import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
      maxlength: 200,
      trim: true,
    },
    banner: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["private", "public"],
      default: "public",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
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

export const List = mongoose.model("List", listSchema);
