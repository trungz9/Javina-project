import express from 'express';
import {
  getProducts, getProductById,
  createProduct, updateProduct, deleteProduct
} from '../controllers/product.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/',     getProducts);                    // GET  /api/products
router.get('/:id',  getProductById);                 // GET  /api/products/:id
router.post('/',    protect, createProduct);         // POST /api/products (cần đăng nhập)
router.put('/:id',  protect, updateProduct);         // PUT  /api/products/:id
router.delete('/:id', protect, deleteProduct);       // DELETE /api/products/:id

export default router;