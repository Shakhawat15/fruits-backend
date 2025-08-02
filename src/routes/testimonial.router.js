import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { imageUpload } from "../middlewares/multer.middleware.js";
import {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getTestimonial,
  statusUpdateTestimonial,
  updateTestimonial,
} from "../contollers/testimonial.controller.js";

const router = express.Router();

// Routes
router.post(
  "/create",
  verifyJWT,
  imageUpload.single("avatar"),
  createTestimonial
);
router.get("/all", getAllTestimonials);
router.get("/get/:id", getTestimonial);
router.put(
  "/update/:id",
  verifyJWT,
  imageUpload.single("avatar"),
  updateTestimonial
);
router.delete("/delete/:id", verifyJWT, deleteTestimonial);
router.patch("/status/:id", verifyJWT, statusUpdateTestimonial);

export default router;
