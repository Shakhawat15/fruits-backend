import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import GalleryFolderModel from "../models/galleryFolder.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create Gallery Folder
const createGalleryFolder = asyncHandler(async (req, res) => {
  const { title, status } = req.body;
  if (!title) {
    throw new ApiError(400, "Gallery folder title is required");
  }

  const existedGalleryFolder = await GalleryFolderModel.findOne({ title });

  if (existedGalleryFolder) {
    throw new ApiError(409, "Gallery folder already exists");
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

  const galleryFolder = await GalleryFolderModel.create({
    title,
    picture: pictureUrl || null,
    status,
    created_by: req.user._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, galleryFolder, "Gallery folder created successfully")
    );
});

// Get All Gallery Folders
const getAllGalleryFolders = asyncHandler(async (req, res) => {
  const galleryFolders = await GalleryFolderModel.find()
    .sort({
      createdAt: -1,
    })
    .populate("created_by", "full_name");

  if (!galleryFolders) {
    throw new ApiError(404, "No gallery folders found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, galleryFolders, "Gallery folders found"));
});

// Get Single Gallery Folder
const getSingleGalleryFolder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const galleryFolder = await GalleryFolderModel.findById(id).populate(
    "created_by",
    "full_name"
  );

  if (!galleryFolder) {
    throw new ApiError(404, "Gallery folder not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, galleryFolder, "Gallery folder found"));
});

// Update Gallery Folder
const updateGalleryFolder = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const galleryFolder = await GalleryFolderModel.findById(req.params.id);

  if (!galleryFolder) {
    throw new ApiError(404, "Gallery folder not found");
  }

  let pictureUrl = galleryFolder.picture;
  if (req.file) {
    try {
      const result = await uploadOnCloudinary(req.file.buffer);
      pictureUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Error uploading avatar");
    }
  }

  galleryFolder.title = title;
  galleryFolder.picture = pictureUrl || galleryFolder.picture;
  galleryFolder.updated_by = req.user._id;

  await galleryFolder.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, galleryFolder, "Gallery folder updated successfully")
    );
});

// Delete Gallery Folder
const deleteGalleryFolder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const galleryFolder = await GalleryFolderModel.findById(id);

  if (!galleryFolder) {
    throw new ApiError(404, "Gallery folder not found");
  }

  const deletedGalleryFolder = await GalleryFolderModel.findByIdAndDelete(id);

  if (!deletedGalleryFolder) {
    throw new ApiError(500, "Gallery folder not deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Gallery folder deleted successfully"));
});

// status update
const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const galleryFolder = await GalleryFolderModel.findById(id);

  if (!galleryFolder) {
    throw new ApiError(404, "Gallery folder not found");
  }

  galleryFolder.status = status;
  galleryFolder.updated_by = req.user._id;

  await galleryFolder.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        galleryFolder,
        "Gallery folder status updated successfully"
      )
    );
});

export {
  createGalleryFolder,
  getAllGalleryFolders,
  getSingleGalleryFolder,
  updateGalleryFolder,
  deleteGalleryFolder,
  updateStatus,
};
