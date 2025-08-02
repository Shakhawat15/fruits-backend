import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { imageUpload } from "../middlewares/multer.middleware.js";
import {
  createGalleryFolder,
  deleteGalleryFolder,
  getAllGalleryFolders,
  getSingleGalleryFolder,
  updateGalleryFolder,
  updateStatus,
} from "../contollers/galleryFolder.controller.js";

const router = express.Router();

// Riutes
router.post(
  "/create",
  verifyJWT,
  imageUpload.single("picture"),
  createGalleryFolder
);
router.get("/all", getAllGalleryFolders);
router.get("/get/:id", verifyJWT, getSingleGalleryFolder);
router.put(
  "/update/:id",
  verifyJWT,
  imageUpload.single("picture"),
  updateGalleryFolder
);
router.delete("/delete/:id", verifyJWT, deleteGalleryFolder);
router.patch("/status/:id", verifyJWT, updateStatus);

export default router;
