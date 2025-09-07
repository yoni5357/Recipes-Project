import express from "express";
import authController from "../controllers/authController";
import { authenticateToken } from "../middleware/authenticateUser";

const router = express.Router();

router.post("/register", authController.addUser);
router.post("/login", authController.loginUser);
router.get("/profile", authenticateToken, authController.getUserProfile);

export default router