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
import currencyRoute from './src/routes/currency.route.js';
import { startCurrencyJob } from './src/jobs/currency.job.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { trie } from './src/utils/Trie.js'
import interactionRoute from './src/routes/interaction.route.js'

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
app.use('/api/currency', currencyRoute);
startCurrencyJob();
app.use(helmet());
app.use('/api/interactions', interactionRoute)

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

const __dirname = dirname(fileURLToPath(import.meta.url));

const loadTrieFromDB = async () => {
  try {
    const [products] = await db.query(
      'SELECT id, name FROM products WHERE is_active = 1'
    )
    for (const p of products) {
      trie.insert(p.name, p.id)
    }
    console.log(`✅ Trie loaded: ${products.length} sản phẩm`)
  } catch (err) {
    console.error('❌ Trie load lỗi:', err.message)
  }
}

loadTrieFromDB()

app.use('/uploads', express.static(join(__dirname, 'uploads')));
dotenv.config();