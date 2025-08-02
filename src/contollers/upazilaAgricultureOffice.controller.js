import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import UpazilaAgricultureOfficeModel from "../models/upazilaAgricultureOffice.model.js";

// Create Upazila Agriculture Office
const createUpazilaAgricultureOffice = asyncHandler(async (req, res) => {
  const { district, name, status } = req.body;
  if (!name) {
    throw new ApiError(400, "Upazila Agriculture Office name is required");
  }

  if (!district) {
    throw new ApiError(400, "District is required");
  }

  const existedUpazilaAgricultureOffice =
    await UpazilaAgricultureOfficeModel.findOne({ name });

  if (existedUpazilaAgricultureOffice) {
    throw new ApiError(409, "Upazila Agriculture Office already exists");
  }

  const upazilaAgricultureOffice = await UpazilaAgricultureOfficeModel.create({
    district,
    name,
    status,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        upazilaAgricultureOffice,
        "Upazila Agriculture Office created successfully"
      )
    );
});

// Get All Upazila Agriculture Offices
const getAllUpazilaAgricultureOffices = asyncHandler(async (req, res) => {
  const upazilaAgricultureOffices = await UpazilaAgricultureOfficeModel.find()
    .populate("district", "name")
    .sort({
      name: 1,
    });

  if (!upazilaAgricultureOffices) {
    throw new ApiError(404, "No upazila agriculture offices found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        upazilaAgricultureOffices,
        "Upazila agriculture offices found"
      )
    );
});

// Get Upazila Agriculture Office By ID
const getUpazilaAgricultureOfficeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const upazilaAgricultureOffice =
    await UpazilaAgricultureOfficeModel.findById(id);

  if (!upazilaAgricultureOffice) {
    throw new ApiError(404, "Upazila Agriculture Office not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        upazilaAgricultureOffice,
        "Upazila Agriculture Office found"
      )
    );
});

// Update Upazila Agriculture Office
const updateUpazilaAgricultureOffice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { district, name, status } = req.body;

  if (!name) {
    throw new ApiError(400, "Upazila Agriculture Office name is required");
  }

  if (!district) {
    throw new ApiError(400, "District is required");
  }

  const upazilaAgricultureOffice =
    await UpazilaAgricultureOfficeModel.findById(id);

  if (!upazilaAgricultureOffice) {
    throw new ApiError(404, "Upazila Agriculture Office not found");
  }

  upazilaAgricultureOffice.district = district;
  upazilaAgricultureOffice.name = name;
  upazilaAgricultureOffice.status = status;

  await upazilaAgricultureOffice.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        upazilaAgricultureOffice,
        "Upazila Agriculture Office updated successfully"
      )
    );
});

// Delete Upazila Agriculture Office
const deleteUpazilaAgricultureOffice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const upazilaAgricultureOffice =
    await UpazilaAgricultureOfficeModel.findById(id);

  if (!upazilaAgricultureOffice) {
    throw new ApiError(404, "Upazila Agriculture Office not found");
  }

  const deletedUpazilaAgricultureOffice =
    await UpazilaAgricultureOfficeModel.findByIdAndDelete(id);

  if (!deletedUpazilaAgricultureOffice) {
    throw new ApiError(500, "Upazila Agriculture Office not deleted");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedUpazilaAgricultureOffice,
        "Upazila Agriculture Office deleted successfully"
      )
    );
});

const getUpazilaAgricultureOfficeByDistrict = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const upazilaAgricultureOffices = await UpazilaAgricultureOfficeModel.find({
    district: id,
  })
    .populate("district", "name")
    .sort({
      name: 1,
    });

  if (!upazilaAgricultureOffices) {
    throw new ApiError(404, "No upazila agriculture offices found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        upazilaAgricultureOffices,
        "Upazila agriculture offices found"
      )
    );
});

export {
  createUpazilaAgricultureOffice,
  getAllUpazilaAgricultureOffices,
  getUpazilaAgricultureOfficeById,
  updateUpazilaAgricultureOffice,
  deleteUpazilaAgricultureOffice,
  getUpazilaAgricultureOfficeByDistrict,
};
