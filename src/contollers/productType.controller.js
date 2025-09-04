import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ProductTypeModel from "../models/productType.model.js";

// Create Product Type
const createProductType = asyncHandler(async (req, res) => {
  const { name, status } = req.body;
  if (!name) {
    throw new ApiError(400, "Product type name is required");
  }

  const existedProductType = await ProductTypeModel.findOne({ name });

  if (existedProductType) {
    throw new ApiError(409, "Product type already exists");
  }

  const productType = await ProductTypeModel.create({ name, status });

  return res
    .status(201)
    .json(
      new ApiResponse(201, productType, "Product type created successfully")
    );
});

// Get All Product Types
const getAllProductTypes = asyncHandler(async (req, res) => {
  const productTypes = await ProductTypeModel.find();

  if (!productTypes) {
    throw new ApiError(404, "No product types found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, productTypes, "Product types found"));
});

// Get Product Type By ID
const getProductTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const productType = await ProductTypeModel.findById(id);

  if (!productType) {
    throw new ApiError(404, "Product type not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, productType, "Product type found"));
});

// Update Product Type
const updateProductType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  if (!name) {
    throw new ApiError(400, "Product type name is required");
  }

  const productType = await ProductTypeModel.findById(id);

  if (!productType) {
    throw new ApiError(404, "Product type not found");
  }

  const existedProductType = await ProductTypeModel.findOne({ name });

  if (existedProductType && existedProductType._id.toString() !== id) {
    throw new ApiError(409, "Product type already exists");
  }

  productType.name = name;
  productType.status = status;

  await productType.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, productType, "Product type updated successfully")
    );
});

// Delete Product Type
const deleteProductType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const productType = await ProductTypeModel.findById(id);

  if (!productType) {
    throw new ApiError(404, "Product type not found");
  }

  const deletedProductType = await ProductTypeModel.findByIdAndDelete(id);

  if (!deletedProductType) {
    throw new ApiError(500, "Product type not deleted");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedProductType,
        "Product type deleted successfully"
      )
    );
});

export {
  createProductType,
  getAllProductTypes,
  getProductTypeById,
  updateProductType,
  deleteProductType,
};
