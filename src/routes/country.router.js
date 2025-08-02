import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCountry,
  deleteCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
} from "../contollers/country.controller.js";

const router = express.Router();

// route
router.post("/create", verifyJWT, createCountry);
router.get("/all", verifyJWT, getAllCountries);
router.get("/get/:id", verifyJWT, getCountryById);
router.put("/update/:id", verifyJWT, updateCountry);
router.delete("/delete/:id", verifyJWT, deleteCountry);

export default router;
