import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import NewsModel from "../models/news.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create News
const createNews = asyncHandler(async (req, res) => {
  const { title, description, status, read_more_link } = req.body;
  if (!title) {
    throw new ApiError(400, "News title is required");
  }

  const existedNews = await NewsModel.findOne({ title });

  if (existedNews) {
    throw new ApiError(409, "News already exists");
  }

  let pictureUrl = null;
  if (req.file) {
    try {
      const result = await uploadOnCloudinary(req.file.buffer);
      pictureUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Error uploading avatar");
    }
  }

  const news = await NewsModel.create({
    title,
    description,
    picture: pictureUrl || null,
    read_more_link,
    status,
    created_by: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, news, "News created successfully"));
});

// Get All News
const getAllNews = asyncHandler(async (req, res) => {
  const news = await NewsModel.find()
    .sort({
      createdAt: -1,
    })
    .populate("created_by", "full_name");

  if (!news) {
    throw new ApiError(404, "No news found");
  }

  return res.status(200).json(new ApiResponse(200, news, "News found"));
});

// Get Single News
const getSingleNews = asyncHandler(async (req, res) => {
  const news = await NewsModel.findById(req.params.id);

  if (!news) {
    throw new ApiError(404, "News not found");
  }

  return res.status(200).json(new ApiResponse(200, news, "News found"));
});

// Update News
const updateNews = asyncHandler(async (req, res) => {
  const { title, description, status, read_more_link } = req.body;

  const news = await NewsModel.findById(req.params.id);

  if (!news) {
    throw new ApiError(404, "News not found");
  }

  let pictureUrl = null;
  if (req.file) {
    try {
      const result = await uploadOnCloudinary(req.file.buffer);
      pictureUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Error uploading avatar");
    }
  }

  const updatedNews = await NewsModel.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      picture: pictureUrl || news.picture,
      read_more_link,
      status,
      updated_by: req.user._id,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedNews, "News updated successfully"));
});

// Delete News
const deleteNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const news = await NewsModel.findById(id);

  if (!news) {
    throw new ApiError(404, "News not found");
  }

  await NewsModel.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "News deleted successfully"));
});

export { createNews, getAllNews, getSingleNews, updateNews, deleteNews };
