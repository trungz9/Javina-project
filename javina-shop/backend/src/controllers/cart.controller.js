import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

import db from '../../config/db.js';

// ── LẤY GIỎ HÀNG ─────────────────────────────────
export const getCart = async (req, res) => {
  try {
    const [items] = await db.query(`
      SELECT
        ci.id, ci.quantity,
        p.id AS product_id, p.name, p.final_price,
        p.stock_qty, p.is_negotiable,
        s.shop_name, s.id AS shop_id,
        (SELECT image_url FROM product_images
         WHERE product_id = p.id AND is_cover = 1 LIMIT 1) AS cover_image
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      JOIN shops    s ON s.id = p.shop_id
      WHERE ci.user_id = ? AND p.is_active = 1
      ORDER BY ci.updated_at DESC
    `, [req.userId]);

    const total = items.reduce((sum, i) => sum + Number(i.final_price) * i.quantity, 0);
    res.json({ items, total });

  } catch (err) {
    console.error('getCart error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── THÊM VÀO GIỎ ─────────────────────────────────
export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: 'Thiếu product_id!' });
    }

    // Kiểm tra sản phẩm còn hàng không
    const [rows] = await db.query(
      'SELECT id, stock_qty FROM products WHERE id = ? AND is_active = 1',
      [product_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
    }
    if (rows[0].stock_qty < quantity) {
      return res.status(400).json({ message: 'Sản phẩm không đủ số lượng!' });
    }

    // Nếu đã có trong giỏ thì cộng thêm số lượng
    await db.query(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `, [req.userId, product_id, quantity]);

    res.json({ message: 'Đã thêm vào giỏ hàng!' });

  } catch (err) {
    console.error('addToCart error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── CẬP NHẬT SỐ LƯỢNG ────────────────────────────
export const updateCartItem = async (req, res) => {
  try {
    const { id }       = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      // Số lượng = 0 → xoá luôn
      await db.query(
        'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
        [id, req.userId]
      );
      return res.json({ message: 'Đã xoá khỏi giỏ hàng!' });
    }

    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, id, req.userId]
    );
    res.json({ message: 'Đã cập nhật số lượng!' });

  } catch (err) {
    console.error('updateCartItem error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── XOÁ KHỎI GIỎ ─────────────────────────────────
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );
    res.json({ message: 'Đã xoá khỏi giỏ hàng!' });
  } catch (err) {
    console.error('removeFromCart error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── XOÁ TOÀN BỘ GIỎ ──────────────────────────────
export const clearCart = async (req, res) => {
  try {
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [req.userId]);
    res.json({ message: 'Đã xoá toàn bộ giỏ hàng!' });
  } catch (err) {
    console.error('clearCart error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};