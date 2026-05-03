import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  getProducts, getProductById,
  createProduct, updateProduct, deleteProduct
} from '../controllers/product.controller.js';
import protect from '../middlewares/auth.middleware.js';
import { searchAutocomplete } from '../controllers/product.controller.js'
import { getRecommendedProducts } from '../controllers/product.controller.js'
import { getClusterRecommendations } from '../controllers/product.controller.js'

// ✅ THÊM: config multer
const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/')) // lưu vào backend/uploads/
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { files: 5, fileSize: 5 * 1024 * 1024 }, // tối đa 5 file, mỗi file 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Chỉ chấp nhận JPG, PNG, WEBP!'))
  }
})

const router = express.Router();

router.get('/autocomplete', searchAutocomplete)
router.get('/recommendations', protect, getRecommendedProducts)

router.get('/:id', getProductById)
router.get('/',     getProducts);
router.get('/:id',  getProductById);
router.post('/',    protect, upload.array('images', 5), createProduct); // ✅ thêm upload vào đây
router.put('/:id',  protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/:productId/similar', getClusterRecommendations)

export default router;