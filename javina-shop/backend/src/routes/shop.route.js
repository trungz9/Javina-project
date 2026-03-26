import express from 'express';
import {
  getMyShop, updateShop,
  getShopProducts, getShopOrders,
  updateOrderStatus, getShopStats
} from '../controllers/shop.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/',               protect, getMyShop);
router.put('/',               protect, updateShop);
router.get('/products',       protect, getShopProducts);
router.get('/orders',         protect, getShopOrders);
router.get('/stats',          protect, getShopStats);
router.put('/orders/:id',     protect, updateOrderStatus);

export default router;