import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';  // nhớ có .js ở cuối
import authRoute from './src/routes/auth.route.js';
import productRoute from './src/routes/product.route.js'; 
import categoryRoute from './src/routes/category.route.js';
import cartRoute  from './src/routes/cart.route.js';
import orderRoute from './src/routes/order.route.js';
import shopRoute from './src/routes/shop.route.js';
import addressRoute from './src/routes/address.route.js';
import helmet    from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

app.use('/api/shop', shopRoute);
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/cart',   cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/addresses', addressRoute);
app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Quá nhiều request, thử lại sau!' }
}));

// Riêng cho auth: 10 req / 15 phút (chống brute force)
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Quá nhiều lần đăng nhập, thử lại sau 15 phút!' }
}));

app.get('/', (req, res) => {
  res.json({ message: '🛒 Javina Shop API đang chạy!' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1+1 AS result');
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));