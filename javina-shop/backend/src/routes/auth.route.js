import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);   // POST /api/auth/register
router.post('/login',    login);      // POST /api/auth/login
router.get('/me',        protect, getMe); // GET /api/auth/me (cần đăng nhập)

export default router;