import express from "express";
import { authenticate } from "../middleware/auth.js";
import { userInfo } from "../controllers/userInfo.js";

const router = express.Router();

router.get('/:userID', authenticate, userInfo)





export default router;