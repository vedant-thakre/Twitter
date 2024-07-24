import { User } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "");

    // console.log(process.env.ACCESS_TOKEN_SECRET);

    if (!token) {
      throw new ErrorHandler(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ErrorHandler(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ErrorHandler(401, error?.message || "Invalide Access Token");
  }
});
