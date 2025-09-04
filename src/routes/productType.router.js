import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createProductType,
  deleteProductType,
  getAllProductTypes,
  getProductTypeById,
  updateProductType,
} from "../contollers/productType.controller.js";

const router = express.Router();

// secure routes
router.post("/create", verifyJWT, createProductType);
router.get("/all", getAllProductTypes);
router.get("/:id", verifyJWT, getProductTypeById);
router.put("/update/:id", verifyJWT, updateProductType);
router.delete("/delete/:id", verifyJWT, deleteProductType);

export default router;
