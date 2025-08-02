import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createNews,
  deleteNews,
  getAllNews,
  getSingleNews,
  updateNews,
} from "../contollers/news.controller.js";
import { imageUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Riutes
router.post("/create", verifyJWT, imageUpload.single("picture"), createNews);
router.get("/all", getAllNews);
router.get("/get/:id", verifyJWT, getSingleNews);
router.put("/update/:id", verifyJWT, imageUpload.single("picture"), updateNews);
router.delete("/delete/:id", verifyJWT, deleteNews);

export default router;
