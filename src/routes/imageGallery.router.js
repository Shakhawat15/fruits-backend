import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { imageUpload } from "../middlewares/multer.middleware.js";
import {
  createImageGallery,
  deleteImageGallery,
  getAllImageGalleries,
  getImageGalleryByGalleryFolder,
  getImageGalleryById,
  statusUpdateImageGallery,
  updateImageGallery,
} from "../contollers/imageGallery.controller.js";

const router = express.Router();

// Routes
router.post(
  "/create",
  verifyJWT,
  imageUpload.single("picture"),
  createImageGallery
);
router.get("/all", verifyJWT, getAllImageGalleries);
router.get("get/:id", verifyJWT, getImageGalleryById);
router.get("/get-by-gallery-folder/:id", getImageGalleryByGalleryFolder);
router.put(
  "/update/:id",
  verifyJWT,
  imageUpload.single("picture"),
  updateImageGallery
);
router.delete("/delete/:id", verifyJWT, deleteImageGallery);
router.put("/status/:id", verifyJWT, statusUpdateImageGallery);

export default router;
