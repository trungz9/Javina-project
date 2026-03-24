import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';  // nhớ có .js ở cuối
import authRoute from './src/routes/auth.route.js';
import productRoute from './src/routes/product.route.js'; 

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);

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