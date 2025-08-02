import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { pdfUpload, upload } from "../middlewares/multer.middleware.js";
import {
  createPdf,
  deletePdf,
  getAllPdfs,
  getSinglePdf,
  updatePdf,
} from "../contollers/pdf.controller.js";

const router = express.Router();

// Routes
router.post("/create", verifyJWT, upload.single("picture"), createPdf);
router.get("/all", getAllPdfs);
router.get("/get/:id", getSinglePdf);
router.put("/update/:id", verifyJWT, pdfUpload.single("file"), updatePdf);
router.delete("/delete/:id", verifyJWT, deletePdf);

export default router;
