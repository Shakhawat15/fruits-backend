import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Helper function to generate random SKU
const generateSKU = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let sku = "";
  for (let i = 0; i < length; i++) {
    sku += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return sku;
};

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  const {
    type_id,
    title,
    quantity,
    rrp,
    discounted_price,
    discount_price,
    description,
  } = req.body;

  if (!type_id) throw new ApiError(400, "Product type is required");
  if (!title) throw new ApiError(400, "Product title is required");
  if (!quantity && quantity !== 0)
    throw new ApiError(400, "Quantity is required");
  if (!rrp && rrp !== 0) throw new ApiError(400, "RRP is required");
  if (!discounted_price && discounted_price !== 0)
    throw new ApiError(400, "Discounted price is required");
  if (!discount_price && discount_price !== 0)
    throw new ApiError(400, "Discount price is required");
  if (!description) throw new ApiError(400, "Description is required");

  // Generate unique SKU
  let sku;
  let exists = true;
  while (exists) {
    sku = generateSKU(8); // 8-character SKU
    const existingProduct = await Product.findOne({ sku });
    if (!existingProduct) exists = false;
  }

  // Handle multiple media files
  let media = [];
  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      try {
        const result = await uploadOnCloudinary(file.buffer);
        media.push(result.secure_url);
      } catch (err) {
        throw new ApiError(500, "Error uploading media");
      }
    }
  }

  // Create the product
  const product = await Product.create({
    product_by: req.user._id, // logged-in user
    type_id,
    title,
    sku, // generated SKU
    quantity,
    rrp,
    discounted_price,
    discount_price,
    description,
    media,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

// Get all products
// (Additional functions like getAllProducts, getProductById, updateProduct, deleteProduct can be added here)
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("product_by", "-password -refresh_token")
    .populate("type_id");

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products retrieved successfully"));
});
const getAllProductsBackend = asyncHandler(async (req, res) => {
  let query = {};

  // If user is a seller, filter by their own _id
  if (req.user.role_id.equals("68b8fb8bf143996efa66acaa")) {
    query.product_by = req.user._id; // keep ObjectId, no need to convert
  }

  const products = await Product.find(query)
    .populate("product_by", "-password -refresh_token")
    .populate("type_id");

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products retrieved successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    type_id,
    title,
    quantity,
    rrp,
    discounted_price,
    discount_price,
    description,
    status,
  } = req.body;

  // Find product
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  // Validate fields
  if (!type_id) throw new ApiError(400, "Product type is required");
  if (!title) throw new ApiError(400, "Product title is required");
  if (!quantity && quantity !== 0)
    throw new ApiError(400, "Quantity is required");
  if (!rrp && rrp !== 0) throw new ApiError(400, "RRP is required");
  if (!discounted_price && discounted_price !== 0)
    throw new ApiError(400, "Discounted price is required");
  if (!discount_price && discount_price !== 0)
    throw new ApiError(400, "Discount price is required");
  if (!description) throw new ApiError(400, "Description is required");

  // Handle media files (keep old + add new)
  let media = [...product.media];
  if (req.files && req.files.length > 0) {
    const newMedia = [];
    for (let file of req.files) {
      try {
        const result = await uploadOnCloudinary(file.buffer);
        newMedia.push(result.secure_url);
      } catch (err) {
        throw new ApiError(500, "Error uploading media");
      }
    }
    media = [...media, ...newMedia];
  }

  // Update product
  product.type_id = type_id;
  product.title = title;
  product.quantity = quantity;
  product.rrp = rrp;
  product.discounted_price = discounted_price;
  product.discount_price = discount_price;
  product.description = description;
  product.status = status ?? product.status;
  product.updated_by = req.user._id;
  product.media = media;

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

// Delete Product
// (Implementation can be added here)
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find product
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  // Delete product
  await Product.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

export {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAllProductsBackend,
};
