import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createVideoGallery,
  deleteVideoGallery,
  getAllVideoGalleries,
  getVideoGalleryById,
  statusUpdateVideoGallery,
  updateVideoGallery,
} from "../contollers/videoGallery.controller.js";

const router = express.Router();

// Routes
router.post("/create", verifyJWT, createVideoGallery);
router.get("/all", verifyJWT, getAllVideoGalleries);
router.get("/get/:id", verifyJWT, getVideoGalleryById);
router.put("/update/:id", verifyJWT, updateVideoGallery);
router.delete("delete/:id", verifyJWT, deleteVideoGallery);
router.patch("/status/:id", verifyJWT, statusUpdateVideoGallery);

export default router;
