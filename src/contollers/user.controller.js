import fs from "fs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Generate Access Token and Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};

// Reister User
const registerUser = asyncHandler(async (req, res) => {
  const { role_id, full_name, email, mobile, password } = req.body;

  if (
    [full_name, email, mobile, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await UserModel.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existedUser) {
    throw new ApiError(409, "Email or mobile already exists");
  }

  // const avatarLocalPath = req.file?.path;

  // const avater = await uploadOnCloudinary(avatarLocalPath);

  let avatarUrl = null;

  if (req.file) {
    try {
      const result = await uploadOnCloudinary(req.file.buffer);
      avatarUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Error uploading avatar");
    }
  }

  const user = await UserModel.create({
    full_name,
    email,
    mobile,
    district,
    password,
    role_id,
    avatar: avatarUrl || null,
  });

  const createdUser = await UserModel.findById(user._id).select(
    "-password -refresh_token"
  );

  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await UserModel.findById(user._id).select(
    "-password -refresh_token"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find()
    .select("-password -refresh_token")
    .populate("role_id"); // Populating role details

  if (!users || users.length === 0) {
    throw new ApiError(404, "Users not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully"));
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await UserModel.findByIdAndUpdate(
    req.user._id,
    { $set: { refresh_token: "" } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Refresh Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await UserModel.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (user.refresh_token !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token revoked");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Token refreshed successfully"
      )
    );
});

// Update User Status
const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await UserModel.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(500, "User status not updated");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User status updated successfully")
    );
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { full_name, role_id, district, email, mobile } = req.body;

  const user = await UserModel.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let avatarUrl = null;

  if (req.file) {
    try {
      const result = await uploadOnCloudinary(req.file.buffer);
      avatarUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Error uploading avatar");
    }
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    {
      full_name,
      role_id,
      district,
      email,
      mobile,
      avatar: avatarUrl || user.avatar,
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(500, "User not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // if (user.photo_path) {
  //   fs.unlinkSync(user.photo_path);
  // }

  await UserModel.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export {
  deleteUser,
  getAllUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUser,
  updateUserStatus,
};
