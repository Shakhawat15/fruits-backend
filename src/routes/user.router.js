import express from "express";
import {
  deleteUser,
  getAllUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUser,
  updateUserStatus,
} from "../contollers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { imageUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Route
router.post("/register", imageUpload.single("avatar"), registerUser);
router.post("/login", loginUser);

// secure route
router.get("/logout", verifyJWT, logoutUser);
router.get("/refresh-token", refreshAccessToken);
router.get("/all", verifyJWT, getAllUsers);
router.patch("/status/:id", verifyJWT, updateUserStatus);
router.put("/update/:id", verifyJWT, imageUpload.single("avatar"), updateUser);
router.delete("/delete/:id", verifyJWT, deleteUser);

export default router;
