import express from "express";

import { callback, checkAccessToken, login, marketData } from "../controllers/kiteAPIs.js";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();

router.get('/login',login)
router.get('/login/callback', callback)
router.get('/marketData', authenticate ,marketData);
router.get('/checkAccessToken',checkAccessToken)

export default router;