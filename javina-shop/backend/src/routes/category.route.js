import express from 'express';
import db from '../../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [categories] = await db.query(
    'SELECT id, name, slug FROM categories WHERE is_active = 1 ORDER BY sort_order'
  );
  res.json({ categories });
});

export default router;