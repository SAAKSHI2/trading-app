import express from "express";
import { authenticate } from "../middleware/auth.js";
import { addStockToBasket, createBasket, deleteBasket, deleteBasketStock, editBasketName, editStockInBasket, getAllBaskets, getBaksetInfo } from "../controllers/basketAPIs.js";

const router = express.Router();

router.get('/users/:user_id', authenticate, getAllBaskets)
router.get('/:basket_id/users/:user_id', authenticate, getBaksetInfo)
router.post('/users/:user_id', authenticate, createBasket)
router.post('/:basket_id/users/:user_id',authenticate, addStockToBasket)
router.put('/:basket_id/users/:user_id/stocks/:stock_id',authenticate, editStockInBasket)
router.put('/:basket_id/users/:user_id/',authenticate, editBasketName)
router.delete('/:basket_id/users/:user_id',authenticate, deleteBasket)
router.delete('/:basket_id/users/:user_id/stocks/:stock_id',authenticate, deleteBasketStock)


export default router;