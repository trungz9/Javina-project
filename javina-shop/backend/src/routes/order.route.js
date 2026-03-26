import express from 'express';
import { createOrder, getMyOrders, getOrderDetail, cancelOrder }
  from '../controllers/order.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/',       protect, createOrder);
router.get('/my',      protect, getMyOrders);
router.get('/:id',     protect, getOrderDetail);
router.put('/:id/cancel', protect, cancelOrder);

export default router;