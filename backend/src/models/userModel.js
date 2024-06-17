import mongoose from "mongoose";

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
)

export const User = mongoose.model("User", userSchema);