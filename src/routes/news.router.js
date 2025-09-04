import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createNews,
  deleteNews,
  getAllNews,
  getSingleNews,
  updateNews,
} from "../contollers/news.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Routes
router.post("/create", verifyJWT, upload.single("picture"), createNews);
router.get("/all", getAllNews);
router.get("/get/:id", verifyJWT, getSingleNews);
router.put("/update/:id", verifyJWT, upload.single("picture"), updateNews);
router.delete("/delete/:id", verifyJWT, deleteNews);

export default router;
