import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import DistrictModel from "./../models/district.model.js";

// Create District
const createDistrict = asyncHandler(async (req, res) => {
  const { name, status } = req.body;
  if (!name) {
    throw new ApiError(400, "District name is required");
  }

  const existedDistrict = await DistrictModel.findOne({ name });

  if (existedDistrict) {
    throw new ApiError(409, "District already exists");
  }

  const district = await DistrictModel.create({ name, status });

  return res
    .status(201)
    .json(new ApiResponse(201, district, "District created successfully"));
});

// Get All Districts
const getAllDistricts = asyncHandler(async (req, res) => {
  const districts = await DistrictModel.find().sort({ name: 1 });

  if (!districts) {
    throw new ApiError(404, "No districts found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, districts, "Districts found"));
});

// Get District By ID
const getDistrictById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const district = await DistrictModel.findById(id);

  if (!district) {
    throw new ApiError(404, "District not found");
  }

  return res.status(200).json(new ApiResponse(200, district, "District found"));
});

// Update District
const updateDistrict = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  if (!name) {
    throw new ApiError(400, "District name is required");
  }

  const district = await DistrictModel.findById(id);

  if (!district) {
    throw new ApiError(404, "District not found");
  }

  district.name = name;
  district.status = status;

  await district.save();

  return res
    .status(200)
    .json(new ApiResponse(200, district, "District updated successfully"));
});

const deleteDistrict = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const district = await DistrictModel.findByIdAndDelete(id);

  if (!district) {
    throw new ApiError(404, "District not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "District deleted successfully"));
});

export {
  createDistrict,
  getAllDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
};
