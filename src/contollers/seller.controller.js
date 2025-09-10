// controllers/seller.controller.js
import Seller from "../models/seller.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import UserModel from "../models/user.model.js";
import crypto from "crypto"; // for random password
import { log } from "console";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create Seller + User
const createSellerApplication = asyncHandler(async (req, res) => {
  const {
    business_name,
    business_type,
    first_name,
    last_name,
    email,
    phone,
    business_address,
    types_of_fruits,
    certifications,
    business_description,
    district,
  } = req.body;

  // Validation
  if (
    !business_name ||
    !business_type ||
    !first_name ||
    !last_name ||
    !email ||
    !phone ||
    !business_address ||
    !business_description
  ) {
    throw new ApiError(400, "All required fields must be filled");
  }

  // Check if user already exists
  let user = await UserModel.findOne({ $or: [{ email }, { mobile: phone }] });

  if (!user) {
    // Generate a random password
    const randomPassword = crypto.randomBytes(6).toString("hex"); // 12 characters
    log("Generated Password:", randomPassword); // For testing purposes only

    // Create user
    user = await UserModel.create({
      full_name: `${first_name} ${last_name}`,
      email,
      mobile: phone,
      passwordtext: randomPassword,
      password: randomPassword,
      role_id: "68b8fb8bf143996efa66acaa", // Seller role ID
      avatar: null,
    });

    // Optionally, send email/SMS with the random password to user
  }

  // Handle file uploads (Multer)
  let documents = null;

  if (req.file) {
    try {
      log("File info:", req.file);
      const result = await uploadOnCloudinary(req.file.buffer);
      documents = result.secure_url;
    } catch (error) {
      throw new ApiError(500, "Error uploading avatar");
    }
  }

  // Create seller document
  const seller = await Seller.create({
    business_name,
    business_type,
    first_name,
    last_name,
    email,
    phone,
    business_address,
    types_of_fruits: Array.isArray(types_of_fruits)
      ? types_of_fruits
      : [types_of_fruits],
    certifications: Array.isArray(certifications)
      ? certifications
      : [certifications],
    business_description,
    documents,
    user_id: user._id,
    is_active: false, // pending by default
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, seller, "Seller application submitted successfully")
    );
});

const getAllSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find()
    .populate("types_of_fruits")
    .populate("user_id", "-password -refresh_token");

  if (!sellers || sellers.length === 0) {
    throw new ApiError(404, "Sellers not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sellers, "All sellers fetched successfully"));
});

const updateSellerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  const seller = await Seller.findByIdAndUpdate(
    id,
    { is_active },
    { new: true }
  );

  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Seller status updated successfully"));
});

// Delete Seller (and associated User) - Optional
const deleteSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const seller = await Seller.findByIdAndDelete(id);
  if (!seller) {
    throw new ApiError(404, "Seller not found");
  } else {
    // Also delete associated user
    await UserModel.findByIdAndDelete(seller.user_id);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Seller deleted successfully"));
});

export {
  createSellerApplication,
  getAllSellers,
  updateSellerStatus,
  deleteSeller,
};
