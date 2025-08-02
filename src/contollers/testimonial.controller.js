import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import TestimonialModel from "../models/testimonial.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new testimonial
const createTestimonial = asyncHandler(async (req, res, next) => {
  const { name, designation, message } = req.body;

  const existingTestimonial = await TestimonialModel.findOne({ name });

  if (existingTestimonial) {
    return next(new ApiError(400, "Testimonial already exists"));
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

  const testimonial = await TestimonialModel.create({
    name,
    designation,
    message,
    picture: pictureUrl,
    created_by: req.user._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, testimonial, "Testimonial created successfully")
    );
});

// Get all testimonials
const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await TestimonialModel.find()
    .populate("created_by", "full_name")
    .sort({
      name: 1,
    });

  if (!testimonials) {
    throw new ApiError(404, "No testimonials found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, testimonials, "Testimonials retrieved successfully")
    );
});

// Get a single testimonial
const getTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await TestimonialModel.findById(req.params.id).populate(
    "created_by",
    "full_name"
  );

  if (!testimonial) {
    return next(new ApiError(404, "Testimonial not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, testimonial, "Testimonial retrieved successfully")
    );
});

// Update a testimonial
const updateTestimonial = asyncHandler(async (req, res, next) => {
  const { name, designation, message } = req.body;
  const { id } = req.params;

  const testimonial = await TestimonialModel.findById(id);

  if (!testimonial) {
    return next(new ApiError(404, "Testimonial not found"));
  }

  let pictureUrl = testimonial.picture;
  if (req.file) {
    try {
      const result = await uploadOnCloudinary(req.file.buffer);
      pictureUrl = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Error uploading avatar");
    }
  }

  testimonial.name = name;
  testimonial.designation = designation;
  testimonial.message = message;
  testimonial.picture = pictureUrl;
  testimonial.updated_by = req.user._id;

  await testimonial.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, testimonial, "Testimonial updated successfully")
    );
});

// Delete a testimonial
const deleteTestimonial = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const testimonial = await TestimonialModel.findById(id);

  if (!testimonial) {
    return next(new ApiError(404, "Testimonial not found"));
  }

  const deletedTestimonial = await TestimonialModel.findByIdAndDelete(id);

  if (!deletedTestimonial) {
    throw new ApiError(500, "Error deleting testimonial");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedTestimonial,
        "Testimonial deleted successfully"
      )
    );
});

// status update testimonial
const statusUpdateTestimonial = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const testimonial = await TestimonialModel.findById(id);

  if (!testimonial) {
    return next(new ApiError(404, "Testimonial not found"));
  }

  testimonial.status = !testimonial.status;
  testimonial.updated_by = req.user._id;

  await testimonial.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        testimonial,
        "Testimonial status updated successfully"
      )
    );
});

export {
  createTestimonial,
  getAllTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
  statusUpdateTestimonial,
};
