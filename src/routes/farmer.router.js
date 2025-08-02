import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createFarmer,
  deleteFarmer,
  getAllFarmers,
  getFarmerByDistrict,
  getFarmerById,
  updateFarmer,
} from "../contollers/farmer.controller.js";
import { imageUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// route
router.post(
  "/create",
  verifyJWT,
  imageUpload.fields([
    { name: "record_book", maxCount: 1 },
    { name: "farmer_picture", maxCount: 1 },
    { name: "garden_picture", maxCount: 1 },
  ]),
  // upload.none(),
  createFarmer
);

router.get("/all", getAllFarmers);
router.get("/get/:id", getFarmerById);
router.get("/get-by-district/:id", getFarmerByDistrict);
router.put(
  "/update/:id",
  verifyJWT,
  imageUpload.fields([
    { name: "fertilizer_recommendation", maxCount: 1 },
    { name: "record_book", maxCount: 1 },
    { name: "farmer_picture", maxCount: 1 },
    { name: "garden_picture", maxCount: 1 },
  ]),
  updateFarmer
);
router.delete("/delete/:id", verifyJWT, deleteFarmer);

export default router;
