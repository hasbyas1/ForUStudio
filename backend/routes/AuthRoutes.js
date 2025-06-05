import express from "express";
import { register, login, verifyToken, logout } from "../controllers/AuthController.js";

const router = express.Router();

// Authentication routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/verify", verifyToken);
router.post("/auth/logout", logout);

export default router;