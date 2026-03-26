import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

import db from '../../config/db.js';

// ── LẤY THÔNG TIN SHOP CỦA TÔI ───────────────────
export const getMyShop = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*,
        COUNT(DISTINCT p.id)  AS product_count,
        COUNT(DISTINCT o.id)  AS order_count,
        COALESCE(SUM(o.total_amount), 0) AS total_revenue
      FROM shops s
      LEFT JOIN products p ON p.shop_id = s.id AND p.is_active = 1
      LEFT JOIN orders   o ON o.shop_id = s.id AND o.status = 'completed'
      WHERE s.user_id = ?
      GROUP BY s.id
    `, [req.userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Bạn chưa có shop!' });
    }
    res.json({ shop: rows[0] });
  } catch (err) {
    console.error('getMyShop error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── CẬP NHẬT THÔNG TIN SHOP ───────────────────────
export const updateShop = async (req, res) => {
  try {
    const { shop_name, description, logo_url, banner_url } = req.body;

    const [rows] = await db.query(
      'SELECT id FROM shops WHERE user_id = ?', [req.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Bạn chưa có shop!' });
    }

    await db.query(`
      UPDATE shops SET
        shop_name   = COALESCE(?, shop_name),
        description = COALESCE(?, description),
        logo_url    = COALESCE(?, logo_url),
        banner_url  = COALESCE(?, banner_url)
      WHERE user_id = ?
    `, [shop_name, description, logo_url, banner_url, req.userId]);

    res.json({ message: 'Cập nhật shop thành công!' });
  } catch (err) {
    console.error('updateShop error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── LẤY SẢN PHẨM CỦA SHOP ────────────────────────
export const getShopProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id FROM shops WHERE user_id = ?', [req.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Bạn chưa có shop!' });
    }

    const [products] = await db.query(`
      SELECT p.*, c.name AS category_name,
        (SELECT image_url FROM product_images
         WHERE product_id = p.id AND is_cover = 1 LIMIT 1) AS cover_image
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.shop_id = ?
      ORDER BY p.created_at DESC
    `, [rows[0].id]);

    res.json({ products });
  } catch (err) {
    console.error('getShopProducts error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── LẤY ĐƠN HÀNG CỦA SHOP ────────────────────────
export const getShopOrders = async (req, res) => {
  try {
    const { status } = req.query;

    const [rows] = await db.query(
      'SELECT id FROM shops WHERE user_id = ?', [req.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Bạn chưa có shop!' });
    }

    let sql = `
      SELECT o.*,
        u.full_name AS buyer_name, u.phone AS buyer_phone,
        a.address, a.ward, a.district, a.province,
        COUNT(oi.id) AS item_count
      FROM orders o
      JOIN users          u  ON u.id  = o.buyer_id
      JOIN user_addresses a  ON a.id  = o.address_id
      JOIN order_items    oi ON oi.order_id = o.id
      WHERE o.shop_id = ?
    `;
    const params = [rows[0].id];

    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }

    sql += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const [orders] = await db.query(sql, params);
    res.json({ orders });
  } catch (err) {
    console.error('getShopOrders error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed','preparing','shipping','delivered','completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ!' });
    }

    // Kiểm tra đơn thuộc shop của mình
    const [rows] = await db.query(`
      SELECT o.id FROM orders o
      JOIN shops s ON s.id = o.shop_id
      WHERE o.id = ? AND s.user_id = ?
    `, [id, req.userId]);

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Không có quyền cập nhật đơn này!' });
    }

    // Ghi nhận thời gian tương ứng
    const timeFields = {
      shipping:  'shipped_at',
      delivered: 'delivered_at',
      completed: 'completed_at',
    };
    const timeField = timeFields[status];
    const sql = timeField
      ? `UPDATE orders SET status = ?, ${timeField} = NOW() WHERE id = ?`
      : `UPDATE orders SET status = ? WHERE id = ?`;

    await db.query(sql, [status, id]);
    res.json({ message: 'Cập nhật trạng thái thành công!' });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── THỐNG KÊ DOANH THU ───────────────────────────
export const getShopStats = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id FROM shops WHERE user_id = ?', [req.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Bạn chưa có shop!' });
    }
    const shopId = rows[0].id;

    // Doanh thu 7 ngày gần nhất
    const [revenue7d] = await db.query(`
      SELECT DATE(created_at) AS date,
             SUM(total_amount) AS revenue
      FROM orders
      WHERE shop_id = ? AND status = 'completed'
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [shopId]);

    // Tổng quan
    const [[summary]] = await db.query(`
      SELECT
        COUNT(CASE WHEN status = 'pending'   THEN 1 END) AS pending_count,
        COUNT(CASE WHEN status = 'shipping'  THEN 1 END) AS shipping_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_count,
        COALESCE(SUM(CASE WHEN status = 'completed'
          THEN total_amount END), 0) AS total_revenue
      FROM orders WHERE shop_id = ?
    `, [shopId]);

    res.json({ revenue7d, summary });
  } catch (err) {
    console.error('getShopStats error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};