import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';
import { DB_NAME } from '../constants.js';
dotenv.config();

export const connectDB = async() => {
    try {
        const connectionRes = await mongoose.connect(
          `${process.env.MONGO_URI}/${DB_NAME}`
        );
        console.log(`MongoDB Connected : ${connectionRes.connection.host}`.bgMagenta.bold);
    } catch (error) {
        console.log("MongoDB Connection Error : ".bgRed.bold, error);
        process.exit(1);
    }
}
//changes more dsfd