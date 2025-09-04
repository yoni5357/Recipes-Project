import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/register", authController.addUser);

export default router