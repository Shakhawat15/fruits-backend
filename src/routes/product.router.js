import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsBackend,
  updateProduct,
} from "../contollers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// routes
router.post(
  "/create",
  verifyJWT, // ensures logged-in user
  upload.array("media"), // multiple files with field name 'media'
  createProduct
);
router.get("/all", getAllProducts);
router.get("/all-backend", verifyJWT, getAllProductsBackend);
router.put(
  "/update/:id",
  verifyJWT,
  upload.array("media", 10), // allow up to 10 files
  updateProduct
);

router.delete("/delete/:id", verifyJWT, deleteProduct);

export default router;
