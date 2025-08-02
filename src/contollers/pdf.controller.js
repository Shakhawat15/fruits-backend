import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import PdfModel from "../models/pdf.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create PDF
const createPdf = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const existedPdf = await PdfModel.findOne({ title });

  if (existedPdf) {
    throw new ApiError(409, "PDF already exists");
  }

  let fileUrl = null;
  console.log("====================================");
  console.log(req.file);
  console.log("====================================");
  if (req.file) {
    try {
      const result = await uploadOnCloudinary(req.file.buffer);
      console.log("====================================");
      console.log(result);
      console.log("====================================");
      fileUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Error uploading PDF");
    }
  }

  const pdf = await PdfModel.create({
    title,
    file: fileUrl,
    created_by: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, pdf, "PDF created successfully"));
});

// Get All PDFs
const getAllPdfs = asyncHandler(async (req, res) => {
  const pdfs = await PdfModel.find().populate("created_by", "full_name").sort({
    title: 1,
  });

  if (!pdfs) {
    throw new ApiError(404, "No PDFs found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, pdfs, "PDFs retrieved successfully"));
});

// Get Single PDF
const getSinglePdf = asyncHandler(async (req, res) => {
  const pdf = await PdfModel.findById(req.params.id).populate(
    "created_by",
    "full_name"
  );

  if (!pdf) {
    throw new ApiError(404, "PDF not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, pdf, "PDF retrieved successfully"));
});

// Update PDF
const updatePdf = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const pdf = await PdfModel.findById(req.params.id);

  if (!pdf) {
    throw new ApiError(404, "PDF not found");
  }

  let fileUrl = pdf.file;
  if (req.file) {
    try {
      const result = await uploadOnCloudinary(req.file.buffer);
      fileUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Error uploading PDF");
    }
  }

  const updatedPdf = await PdfModel.findByIdAndUpdate(
    req.params.id,
    {
      title,
      file: fileUrl || pdf.file,
      updated_by: req.user._id,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPdf, "PDF updated successfully"));
});

// Delete PDF
const deletePdf = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const pdf = await PdfModel.findById(id);

  if (!pdf) {
    throw new ApiError(404, "PDF not found");
  }

  const deletedPdf = await PdfModel.findByIdAndDelete(id);

  if (!deletedPdf) {
    throw new ApiError(404, "PDF not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "PDF deleted successfully"));
});

export { createPdf, getAllPdfs, getSinglePdf, updatePdf, deletePdf };
