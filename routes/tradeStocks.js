import express from "express";
import { authenticate } from "../middleware/auth.js";
import { buyStock, currentStocksInfo, getTransactionLogs, sellStock } from "../controllers/tradeStocks.js";

const router = express.Router();

router.post('/sell', authenticate, sellStock)
router.post('/buy', authenticate, buyStock)
router.get('/currentStocks/:type/:user_id', authenticate, currentStocksInfo)
router.get('/transactionLogs/:phoneNumber',authenticate, getTransactionLogs)


export default router;