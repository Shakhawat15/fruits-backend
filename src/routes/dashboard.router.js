import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../contollers/dashboard.controller.js";

const router = express.Router();

router.get("/dashboard-stats", verifyJWT, getDashboardStats);

export default router;
