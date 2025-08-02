import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import VideoGalleryModel from "../models/videoGallery.model.js";

// Create Video Gallery
const createVideoGallery = asyncHandler(async (req, res) => {
  const { title, youtube_link } = req.body;
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!youtube_link) {
    throw new ApiError(400, "Youtube link is required");
  }

  const existedVideoGallery = await VideoGalleryModel.findOne({ title });

  if (existedVideoGallery) {
    throw new ApiError(409, "Video Gallery already exists");
  }

  const videoGallery = await VideoGalleryModel.create({
    title,
    youtube_link,
    created_by: req.user._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, videoGallery, "Video Gallery created successfully")
    );
});

// Get All Video Galleries
const getAllVideoGalleries = asyncHandler(async (req, res) => {
  const videoGalleries = await VideoGalleryModel.find()
    .populate("created_by", "name")
    .sort({
      title: 1,
    });

  if (!videoGalleries) {
    throw new ApiError(404, "No video galleries found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoGalleries, "Video galleries found"));
});

// Get Video Gallery By ID
const getVideoGalleryById = asyncHandler(async (req, res) => {
  const videoGallery = await VideoGalleryModel.findById(req.params.id).populate(
    "created_by",
    "name"
  );

  if (!videoGallery) {
    throw new ApiError(404, "Video Gallery not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoGallery, "Video Gallery found"));
});

// Update Video Gallery
const updateVideoGallery = asyncHandler(async (req, res) => {
  const { title, youtube_link } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!youtube_link) {
    throw new ApiError(400, "Youtube link is required");
  }

  const videoGallery = await VideoGalleryModel.findByIdAndUpdate(
    req.params.id,
    {
      title,
      youtube_link,
      updated_by: req.user._id,
    },
    { new: true }
  );

  if (!videoGallery) {
    throw new ApiError(404, "Video Gallery not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoGallery, "Video Gallery updated successfully")
    );
});

// Delete Video Gallery
const deleteVideoGallery = asyncHandler(async (req, res) => {
  const videoGallery = await VideoGalleryModel.findByIdAndDelete(req.params.id);

  if (!videoGallery) {
    throw new ApiError(404, "Video Gallery not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video Gallery deleted successfully"));
});

// status update Video Gallery
const statusUpdateVideoGallery = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const videoGallery = await VideoGalleryModel.findByIdAndUpdate(
    req.params.id,
    {
      status,
      updated_by: req.user._id,
    },
    { new: true }
  );

  if (!videoGallery) {
    throw new ApiError(404, "Video Gallery not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        videoGallery,
        "Video Gallery status updated successfully"
      )
    );
});

export {
  createVideoGallery,
  getAllVideoGalleries,
  getVideoGalleryById,
  updateVideoGallery,
  deleteVideoGallery,
  statusUpdateVideoGallery,
};
