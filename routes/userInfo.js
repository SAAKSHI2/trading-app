import express from "express";
import { authenticate } from "../middleware/auth.js";
import { deleteUser, updateUserInfo, userInfo } from "../controllers/userInfo.js";

const router = express.Router();

router.get('/:userID', authenticate, userInfo)
router.delete('/:userID', authenticate, deleteUser)
router.patch('/:userID',authenticate,updateUserInfo)





export default router;