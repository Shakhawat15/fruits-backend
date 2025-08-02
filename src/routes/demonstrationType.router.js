import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createDemonstrationType,
  deleteDemonstrationType,
  getAllDemonstrationTypes,
  getDemonstrationTypeById,
  updateDemonstrationType,
  updateDemonstrationTypeStatus,
} from "../contollers/demonstrationType.controller.js";

const router = express.Router();

// Routes
router.post("/create", verifyJWT, createDemonstrationType);
router.get("/all", verifyJWT, getAllDemonstrationTypes);
router.get("get/:id", verifyJWT, getDemonstrationTypeById);
router.put("/update/:id", verifyJWT, updateDemonstrationType);
router.delete("/delete/:id", verifyJWT, deleteDemonstrationType);
router.put("/update-status/:id", verifyJWT, updateDemonstrationTypeStatus);

export default router;
