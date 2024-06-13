import express from "express";

import { addStopLoss, deleteStopLoss, executeStopLoss, getAllStopLoss, updateStopLoss,isActiveMark } from "../controllers/stopLossAPIs.js";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();

router.post('/:userId', authenticate,addStopLoss)
router.get('/:userId',authenticate, getAllStopLoss)
router.delete('/userId/:userId/orderId/:orderId', authenticate ,deleteStopLoss)
router.put('/userId/:userId/orderId/:orderId',authenticate, updateStopLoss)
router.post('/execute/userId/:userId/',authenticate, executeStopLoss)
router.post('/isActive/userId/:userId/',authenticate, isActiveMark)



export default router;