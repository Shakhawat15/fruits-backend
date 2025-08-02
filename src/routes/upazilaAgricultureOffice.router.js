import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createUpazilaAgricultureOffice,
  deleteUpazilaAgricultureOffice,
  getAllUpazilaAgricultureOffices,
  getUpazilaAgricultureOfficeByDistrict,
  getUpazilaAgricultureOfficeById,
  updateUpazilaAgricultureOffice,
} from "../contollers/upazilaAgricultureOffice.controller.js";

const router = express.Router();

// Routes
router.post("/create", verifyJWT, createUpazilaAgricultureOffice);
router.get("/all", verifyJWT, getAllUpazilaAgricultureOffices);
router.get("/get/:id", verifyJWT, getUpazilaAgricultureOfficeById);
router.put("/update/:id", verifyJWT, updateUpazilaAgricultureOffice);
router.delete("/delete/:id", verifyJWT, deleteUpazilaAgricultureOffice);
router.get(
  "/get-by-upazila/:id",
  verifyJWT,
  getUpazilaAgricultureOfficeByDistrict
);

export default router;
