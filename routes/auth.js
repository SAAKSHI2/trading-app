import express from "express";

import { login, register,logout, verifyOTP, setPassword } from "../controllers/auth.js";
import { resendOTP } from "../controllers/auth.js";

const router = express.Router();

router.post('/login',login)
router.post('/verifyOTP',verifyOTP)
router.post('/setPassword',setPassword)
router.post('/register',register)
router.post('/resendOTP',resendOTP)
router.post('/logout',logout)

export default router;