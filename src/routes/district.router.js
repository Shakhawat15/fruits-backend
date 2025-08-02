import express from "express";
import {
  createDistrict,
  getAllDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
} from "../contollers/district.controller.js";
import { verifyJWT } from "./../middlewares/auth.middleware.js";

const router = express.Router();

// Route
router.post("/create", verifyJWT, createDistrict);
router.get("/all", getAllDistricts);
router.get("/get/:id", verifyJWT, getDistrictById);
router.put("/update/:id", verifyJWT, updateDistrict);
router.delete("/delete/:id", verifyJWT, deleteDistrict);

export default router;
