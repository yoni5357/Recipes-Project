import express from "express";
import authController from "../controllers/authController";
import { authenticateToken } from "../middleware/authenticateUser";

const router = express.Router();



export default router;