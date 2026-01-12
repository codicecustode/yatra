import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import {authenticate} from "../middleware/auth.middleware"
const router = Router();

// Register a new user
router.post("/signup", authController.signup);

// Verify user OTP
router.post("/verify", authController.verifyOtp);

// Login user and issue tokens
router.post("/signin", authController.signin);

// Refresh access token
router.post("/refresh", authController.refresh);

// Logout user and invalidate session
router.post("/logout", authenticate, authController.logout);

export default router;
