import mongoose from 'mongoose';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { User } from "../models/userModel.js";
import { generateRefreshAndAccessToken } from "../utils/tokenGenerate.js";
import { uploadFile } from "../utils/fileHandler.js";
import { Response } from "../utils/responseHandler.js";
import bcrypt from "bcryptjs";

const options = {
  httpOnly: true,
  secure: true,
};

export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, name, password } = req.body;

  if ([email, username, name, password].some((field) => field.trim() === "")) {
    throw new ErrorHandler(400, "All fileds are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ErrorHandler(409, "User with email or username already exists");
  }
  //   console.log(req.files);

  const profileImageLocalPath = req.files?.profileImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!profileImageLocalPath) {
    throw new ErrorHandler(400, "Profile Image file is required");
  }

  const profileImage = await uploadFile(profileImageLocalPath);
  const coverImage = await uploadFile(coverImageLocalPath);

  if (!profileImage) {
    throw new ErrorHandler(400, "Profile Image file is required");
  }

  const user = await User.create({
    name,
    profileImage: profileImage.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ErrorHandler(
      500,
      "Something went wrong while registering the user"
    );
  }

  return res
    .status(201)
    .json(new Response(200, createdUser, "User registered Successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email)
    throw new ErrorHandler(400, "Username or Email is Required");

  const findUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!findUser) throw new ErrorHandler(404, "User not Found");

  // Added logs for debugging
  console.log("Found User:", findUser);
  console.log("Entered Password:", password);

  // Use bcrypt compare function directly for better debugging
  const isMatch = await bcrypt.compare(password, findUser.password);

  if (!isMatch) throw new ErrorHandler(404, "Incorrect Password");

  const { refreshToken, accessToken } = await generateRefreshAndAccessToken(
    findUser._id
  );

  const loggedInUser = await User.findById(findUser._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new Response(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        `Welcome back ${findUser?.name}`
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const id = req.user._id;

  const user = await User.findByIdAndUpdate(
    id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Response(200, {}, "User Logged Out"));
});
