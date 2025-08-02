import express from "express";
import {
  createComment,
  getAllComments,
} from "../contollers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// route
router.post("/create", createComment);
router.get("/all", verifyJWT, getAllComments);

export default router;
