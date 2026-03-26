import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart }
  from '../controllers/cart.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/',        protect, getCart);
router.post('/',       protect, addToCart);
router.put('/:id',     protect, updateCartItem);
router.delete('/clear',protect, clearCart);
router.delete('/:id',  protect, removeFromCart);

export default router;