import User from "../models/user.model.js";
import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "./../utils/apiError.js";
import { apiResponse } from "./../utils/apiResponse.js";
import { validationResult } from "express-validator";
import uploadOnCLoudinary from "../services/cloudinary.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const avatar = req?.file;
  console.log(avatar?.path);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "validation failed", errors.array());
  }
  if (!avatar) {
    throw new ApiError(400, "avatar url is required");
  }

  const alreadyExits = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (alreadyExits) {
    throw new ApiError(400, "user already exits");
  }

  const profile = await uploadOnCLoudinary(avatar?.path);
  if (!profile) {
    throw new ApiError(400, "problem in upload on cloudinary");
  }

  const user = await User.create({
    username,
    email,
    password,
    profilePhoto: profile?.url,
  });

  return res
    .status(201)
    .json(new apiResponse(201, user, "user register successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "validation faild", errors?.array());
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "password is not correct");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return res
    .status(200)
    .cookie("accessToke", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new apiResponse(
        200,
        {
          accessToken,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePhoto: user.profilePhoto,
          },
        },
        "user logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req?.user?.id },
    { $unset: { refreshToken: 1 } }
  );
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new apiResponse(200, {}, "logged out successfully"));
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = req?.user;
  return res
    .status(200)
    .json(new apiResponse(200, user, "profile fetched successfully"));
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req?.cookies?.refreshToken;
  if (!token) {
    throw new ApiError(401, "UnAuthorized");
  }
  const user = await User.findOne({ refreshToken: token });

  if (!user) {
    throw new ApiError(401, "UnAuthorized");
  }
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();
  user.refreshToken = newRefreshToken;
  await user.save();

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(new apiResponse(200, {}, "token refreshed successfully"));
});
