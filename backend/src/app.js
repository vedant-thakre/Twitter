// importing packages
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// importing Routes
import userRoutes from './routes/userRoutes.js';

export const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // storing the static assets in the public folder
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRoutes);
