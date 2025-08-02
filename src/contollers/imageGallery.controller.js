import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ImageGalleryModel from "../models/imageGallery.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create Image Gallery
const createImageGallery = asyncHandler(async (req, res) => {
  const { title, gallery_folder } = req.body;
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!gallery_folder) {
    throw new ApiError(400, "Gallery folder is required");
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

  const existedImageGallery = await ImageGalleryModel.findOne({ title });

  if (existedImageGallery) {
    throw new ApiError(409, "Image Gallery already exists");
  }

  const imageGallery = await ImageGalleryModel.create({
    title,
    picture: pictureUrl || null,
    gallery_folder,
    created_by: req.user._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, imageGallery, "Image Gallery created successfully")
    );
});

// Get All Image Galleries
const getAllImageGalleries = asyncHandler(async (req, res) => {
  const imageGalleries = await ImageGalleryModel.find()
    .populate("created_by", "full_name")
    .populate("gallery_folder", "title")
    .sort({
      title: 1,
    });

  if (!imageGalleries) {
    throw new ApiError(404, "No image galleries found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, imageGalleries, "Image galleries found"));
});

// Get Image Gallery By ID
const getImageGalleryById = asyncHandler(async (req, res) => {
  const imageGallery = await ImageGalleryModel.findById(req.params.id)
    .populate("created_by", "full_name")
    .populate("gallery_folder", "title");

  if (!imageGallery) {
    throw new ApiError(404, "Image Gallery not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, imageGallery, "Image Gallery found"));
});

// Get Image Gallery By Gallery Folder
const getImageGalleryByGalleryFolder = asyncHandler(async (req, res) => {
  const imageGalleries = await ImageGalleryModel.find({
    gallery_folder: req.params.id,
  })
    .populate("created_by", "full_name")
    .populate("gallery_folder", "title")
    .sort({
      title: 1,
    });

  if (!imageGalleries) {
    throw new ApiError(404, "No image galleries found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, imageGalleries, "Image galleries found"));
});

// Update Image Gallery
const updateImageGallery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, gallery_folder } = req.body;
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!gallery_folder) {
    throw new ApiError(400, "Gallery folder is required");
  }

  let picture = null;
  if (req.file) {
    try {
      const result = await uploadOnCloudinary(req.file.buffer);
      picture = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Error uploading avatar");
    }
  }

  const imageGallery = await ImageGalleryModel.findById(id);

  if (!imageGallery) {
    throw new ApiError(404, "Image Gallery not found");
  }

  const updatedImageGallery = await ImageGalleryModel.findByIdAndUpdate(
    req.params.id,
    {
      title,
      picture: picture || imageGallery.picture,
      gallery_folder,
      updated_by: req.user._id,
    },
    {
      new: true,
    }
  );

  if (!updatedImageGallery) {
    throw new ApiError(404, "Image Gallery not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedImageGallery,
        "Image Gallery updated successfully"
      )
    );
});

// Delete Image Gallery
const deleteImageGallery = asyncHandler(async (req, res) => {
  const imageGallery = await ImageGalleryModel.findByIdAndDelete(req.params.id);

  if (!imageGallery) {
    throw new ApiError(404, "Image Gallery not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Image Gallery deleted successfully"));
});

// status update Image Gallery
const statusUpdateImageGallery = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const imageGallery = await ImageGalleryModel.findByIdAndUpdate(
    req.params.id,
    {
      status,
      updated_by: req.user._id,
    },
    {
      new: true,
    }
  );

  if (!imageGallery) {
    throw new ApiError(404, "Image Gallery not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        imageGallery,
        "Image Gallery status updated successfully"
      )
    );
});

export {
  createImageGallery,
  getAllImageGalleries,
  getImageGalleryById,
  updateImageGallery,
  deleteImageGallery,
  statusUpdateImageGallery,
  getImageGalleryByGalleryFolder,
};
