import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import CommentModel from "../models/comment.model.js";

// Create a new comment
const createComment = asyncHandler(async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  console.log("====================================");
  console.log(req.body);
  console.log("====================================");

  if (!name || !phone || !message) {
    return next(new ApiError("All fields are required", 400));
  }

  const comment = await CommentModel.create({
    name,
    email,
    phone,
    message,
  });

  if (!comment) {
    return next(new ApiError("Comment not created", 400));
  }

  return res.status(201).json(new ApiResponse("Comment created", comment));
});

// Get all comments
const getAllComments = asyncHandler(async (req, res, next) => {
  const comments = await CommentModel.find().sort({
    createdAt: -1,
  });

  if (!comments) {
    return next(new ApiError("No comments found", 404));
  }

  return res.status(200).json(new ApiResponse("All comments", comments));
});

// Get comment by id

export { createComment, getAllComments };
