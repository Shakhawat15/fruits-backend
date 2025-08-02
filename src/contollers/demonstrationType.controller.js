import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import DemonstrationTypeModel from "./../models/demonstrationType.model.js";

// Create Demonstration Type
const createDemonstrationType = asyncHandler(async (req, res) => {
  const { title, status } = req.body;
  const user_id = req.user._id;

  if ([title].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const demonstrationType = await DemonstrationTypeModel.create({
    title,
    status,
    created_by: user_id,
  });

  if (!demonstrationType) {
    throw new ApiError(500, "Demonstration Type not created");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        demonstrationType,
        "Demonstration Type created successfully"
      )
    );
});

// Get All Demonstration Types
const getAllDemonstrationTypes = asyncHandler(async (req, res) => {
  const demonstrationTypes = await DemonstrationTypeModel.find().sort({
    title: 1,
  });

  if (!demonstrationTypes) {
    throw new ApiError(404, "No Demonstration Type found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, demonstrationTypes, "All Demonstration Types"));
});

// Get Demonstration Type By Id
const getDemonstrationTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const demonstrationType = await DemonstrationTypeModel.findById(id);

  if (!demonstrationType) {
    throw new ApiError(404, "Demonstration Type not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, demonstrationType, "Demonstration Type"));
});

// Update Demonstration Type
const updateDemonstrationType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  if ([title].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const demonstrationType = await DemonstrationTypeModel.findByIdAndUpdate(
    id,
    { title, status, updated_by: req.user._id },
    { new: true }
  );

  if (!demonstrationType) {
    throw new ApiError(500, "Demonstration Type not updated");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        demonstrationType,
        "Demonstration Type updated successfully"
      )
    );
});

// Delete Demonstration Type
const deleteDemonstrationType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const demonstrationType = await DemonstrationTypeModel.findByIdAndDelete(id);

  if (!demonstrationType) {
    throw new ApiError(500, "Demonstration Type not deleted");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Demonstration Type deleted successfully")
    );
});

// Update Demonstration Type Status
const updateDemonstrationTypeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const demonstrationType = await DemonstrationTypeModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!demonstrationType) {
    throw new ApiError(500, "Demonstration Type status not updated");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        demonstrationType,
        "Demonstration Type status updated successfully"
      )
    );
});

export {
  createDemonstrationType,
  getAllDemonstrationTypes,
  getDemonstrationTypeById,
  updateDemonstrationType,
  deleteDemonstrationType,
  updateDemonstrationTypeStatus,
};
