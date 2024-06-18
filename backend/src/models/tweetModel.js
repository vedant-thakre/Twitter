import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            maxlength: 280,
            trim: true,
        },
        impressions: {
            type: Number,
            default: 0
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,

        },
        media: [
            {
                type: String,
                required: false
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Like"
            }
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tweet"
            }
        ],
        retweets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tweet"
            }
        ],
        originalTweet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet',
            required: false  // Only present if this tweet is a retweet
        },
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet',
            required: false // Only present if this tweet is a reply to another tweet
        },
        // thread: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Thread',
        //     required: false // Only present if this tweet is part of a thread
        // },
    },
    {
        timestamps: true
    }
)

export const Tweet = mongoose.model("Tweet", tweetSchema);