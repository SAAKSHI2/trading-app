import express from "express";
import { authenticate } from "../middleware/auth.js";
import { currentOptionStocksInfo, sellOption,buyOption, getOptionInfo } from "../controllers/optionTrading.js";
const router = express.Router();

router.post('/sell', authenticate, sellOption)
router.post('/buy', authenticate, buyOption)
router.get('/currentOptionStocks/:user_id', authenticate, currentOptionStocksInfo)
router.get('/getOptionInfo/:symbol', getOptionInfo);


export default router;