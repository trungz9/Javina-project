import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

import db from '../../config/db.js';

// Tạo mã đơn hàng tự động
const genOrderCode = async () => {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const [[{ cnt }]] = await db.query(
    'SELECT COUNT(*) AS cnt FROM orders WHERE DATE(created_at) = CURDATE()'
  );
  return `JS-${date}-${String(cnt + 1).padStart(4,'0')}`;
};

// ── ĐẶT HÀNG ─────────────────────────────────────
export const createOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { address_id, note = '', shipping_fee = 0, items } = req.body;

    // items = [{ product_id, quantity, unit_price }]
    if (!address_id || !items?.length) {
      return res.status(400).json({ message: 'Thiếu thông tin đặt hàng!' });
    }

    // Kiểm tra địa chỉ thuộc về user
    const [addrRows] = await conn.query(
      'SELECT id FROM user_addresses WHERE id = ? AND user_id = ?',
      [address_id, req.userId]
    );
    if (addrRows.length === 0) {
      return res.status(400).json({ message: 'Địa chỉ không hợp lệ!' });
    }

    // Lấy shop_id từ sản phẩm đầu tiên
    const [prodRows] = await conn.query(
      'SELECT shop_id, stock_qty FROM products WHERE id = ?',
      [items[0].product_id]
    );
    if (prodRows.length === 0) {
      return res.status(400).json({ message: 'Sản phẩm không tồn tại!' });
    }
    const shop_id = prodRows[0].shop_id;

    // Tính tổng tiền
    const subtotal = items.reduce(
      (sum, i) => sum + Number(i.unit_price) * i.quantity, 0
    );
    const total_amount = subtotal + Number(shipping_fee);
    const order_code   = await genOrderCode();

    // Tạo đơn hàng
    const [orderResult] = await conn.query(`
      INSERT INTO orders
        (order_code, buyer_id, shop_id, address_id,
         subtotal, shipping_fee, total_amount, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [order_code, req.userId, shop_id, address_id,
        subtotal, shipping_fee, total_amount, note]);

    const order_id = orderResult.insertId;

    // Lưu từng sản phẩm trong đơn
    for (const item of items) {
      const [p] = await conn.query(
        'SELECT name, stock_qty FROM products WHERE id = ?',
        [item.product_id]
      );
      if (p[0].stock_qty < item.quantity) {
        await conn.rollback();
        return res.status(400).json({
          message: `Sản phẩm "${p[0].name}" không đủ số lượng!`
        });
      }

      await conn.query(`
        INSERT INTO order_items
          (order_id, product_id, product_name, unit_price, quantity, total_price)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [order_id, item.product_id, p[0].name,
          item.unit_price, item.quantity,
          item.unit_price * item.quantity]);

      // Trừ tồn kho
      await conn.query(
        'UPDATE products SET stock_qty = stock_qty - ?, sold_qty = sold_qty + ? WHERE id = ?',
        [item.quantity, item.quantity, item.product_id]
      );
    }

    // Xoá giỏ hàng sau khi đặt
    await conn.query(
      'DELETE FROM cart_items WHERE user_id = ?', [req.userId]
    );

    await conn.commit();
    res.status(201).json({
      message: 'Đặt hàng thành công!',
      order_id,
      order_code,
      total_amount
    });

  } catch (err) {
    await conn.rollback();
    console.error('createOrder error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  } finally {
    conn.release();
  }
};

// ── LẤY DANH SÁCH ĐƠN HÀNG CỦA TÔI ─────────────
export const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, s.shop_name,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
      FROM orders o
      JOIN shops s ON s.id = o.shop_id
      WHERE o.buyer_id = ?
      ORDER BY o.created_at DESC
    `, [req.userId]);

    res.json({ orders });
  } catch (err) {
    console.error('getMyOrders error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── CHI TIẾT ĐƠN HÀNG ────────────────────────────
export const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT o.*, s.shop_name,
             a.recipient, a.phone, a.address,
             a.ward, a.district, a.province
      FROM orders o
      JOIN shops          s ON s.id = o.shop_id
      JOIN user_addresses a ON a.id = o.address_id
      WHERE o.id = ? AND o.buyer_id = ?
    `, [id, req.userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
    }

    const [items] = await db.query(`
      SELECT oi.*, p.slug AS product_slug,
        (SELECT image_url FROM product_images
         WHERE product_id = oi.product_id AND is_cover = 1 LIMIT 1) AS cover_image
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
    `, [id]);

    res.json({ order: { ...rows[0], items } });

  } catch (err) {
    console.error('getOrderDetail error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── HUỶ ĐƠN HÀNG ─────────────────────────────────
export const cancelOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { id }           = req.params;
    const { cancel_reason } = req.body;

    const [rows] = await conn.query(
      'SELECT status FROM orders WHERE id = ? AND buyer_id = ?',
      [id, req.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
    }
    if (!['pending','confirmed'].includes(rows[0].status)) {
      return res.status(400).json({ message: 'Không thể huỷ đơn hàng ở trạng thái này!' });
    }

    // Hoàn lại tồn kho
    const [items] = await conn.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = ?', [id]
    );
    for (const item of items) {
      await conn.query(
        'UPDATE products SET stock_qty = stock_qty + ?, sold_qty = sold_qty - ? WHERE id = ?',
        [item.quantity, item.quantity, item.product_id]
      );
    }

    await conn.query(
      'UPDATE orders SET status = "cancelled", cancel_reason = ? WHERE id = ?',
      [cancel_reason || 'Người mua huỷ', id]
    );

    await conn.commit();
    res.json({ message: 'Đã huỷ đơn hàng!' });

  } catch (err) {
    await conn.rollback();
    console.error('cancelOrder error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  } finally {
    conn.release();
  }
};