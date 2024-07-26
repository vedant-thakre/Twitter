import mongoose from "mongoose";
import pkg from "bcryptjs";
const { hash, compare } = pkg;
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            minlength: 3,
            maxlength: 20,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        bio: {
            type: String,
            maxlength: 160,
            trim: true,
        },
        location: {
            type: String,
            maxlength: 30,
            trim: true,
        },
        website: {
            type: String,
            maxlength: 100,
            lowercase: true,
            trim: true,
        },
        birthday: {
            type: Date,
            trim: true,
        },
        profileImage: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        post: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tweet"
            }
        ],
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tweet"
            }
        ],
        interests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hashtag"
            }
        ],
        subscription: {
            plan: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Plan' 
            },
            validUntil: { 
                type: Date 
            }
        },
    }, 
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      name: this.name,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);