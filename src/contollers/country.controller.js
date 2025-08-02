import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import CountryModel from "../models/country.model.js";

// Create a new country
const createCountry = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new ApiError("Country name is required", 400));
  }

  const countryExists = await CountryModel.findOne({
    name: { $regex: new RegExp(name, "i") },
  }).exec();

  if (countryExists) {
    return next(new ApiError("Country already exists", 400));
  }

  const country = await CountryModel.create({
    name,
    created_by: req.user._id,
  });

  if (!country) {
    return next(new ApiError("Country not created", 400));
  }

  return res.status(201).json(new ApiResponse("Country created", country));
});

// Get all countries
const getAllCountries = asyncHandler(async (req, res, next) => {
  const countries = await CountryModel.find().sort({
    name: 1,
  });

  if (!countries) {
    return next(new ApiError("No countries found", 404));
  }

  return res.status(200).json(new ApiResponse("All countries", countries));
});

// Get country by id
const getCountryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const country = await CountryModel.findById(id).exec();

  if (!country) {
    return next(new ApiError("Country not found", 404));
  }

  return res.status(200).json(new ApiResponse("Country", country));
});

// Update country by id
const updateCountry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return next(new ApiError("Country name is required", 400));
  }

  const country = await CountryModel.findByIdAndUpdate(
    id,
    {
      name,
      updated_by: req.user._id,
    },
    {
      new: true,
    }
  ).exec();

  if (!country) {
    return next(new ApiError("Country not updated", 400));
  }

  return res.status(200).json(new ApiResponse("Country updated", country));
});

// Delete country by id
const deleteCountry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const country = await CountryModel.findByIdAndDelete(id).exec();

  if (!country) {
    return next(new ApiError("Country not deleted", 400));
  }

  return res.status(200).json(new ApiResponse("Country deleted", country));
});

export {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
};
