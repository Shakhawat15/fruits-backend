import express from "express";
import {
  createSellerApplication,
  deleteSeller,
  getAllSellers,
  updateSellerStatus,
} from "../contollers/seller.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// public routes
router.post("/create", upload.single("documents"), createSellerApplication);
router.get("/all", verifyJWT, getAllSellers);
router.patch("/status/:id", verifyJWT, updateSellerStatus);
router.delete("/delete/:id", verifyJWT, deleteSeller);

export default router;
