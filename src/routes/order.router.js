import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../contollers/order.controller.js";

const router = express.Router();

// secure routes
router.post("/create", verifyJWT, createOrder);
router.get("/all", verifyJWT, getAllOrders);
router.patch("/update/:orderId/payment-status", verifyJWT, updatePaymentStatus);
router.patch("/update/:orderId/order-status", verifyJWT, updateOrderStatus);

export default router;
