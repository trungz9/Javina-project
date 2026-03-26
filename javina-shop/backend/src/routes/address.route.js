import express from 'express';
import db      from '../../config/db.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

// Lấy danh sách địa chỉ
router.get('/', protect, async (req, res) => {
  const [addresses] = await db.query(
    'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC',
    [req.userId]
  );
  res.json({ addresses });
});

// Thêm địa chỉ mới
router.post('/', protect, async (req, res) => {
  const { label, recipient, phone, province, district, ward, address, is_default } = req.body;
  if (!recipient || !phone || !province || !district || !ward || !address) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ địa chỉ!' });
  }
  if (is_default) {
    await db.query(
      'UPDATE user_addresses SET is_default = 0 WHERE user_id = ?',
      [req.userId]
    );
  }
  const [result] = await db.query(
    `INSERT INTO user_addresses
       (user_id, label, recipient, phone, province, district, ward, address, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.userId, label || 'Nhà', recipient, phone,
     province, district, ward, address, is_default ? 1 : 0]
  );
  res.status(201).json({ message: 'Thêm địa chỉ thành công!', id: result.insertId });
});

// Xoá địa chỉ
router.delete('/:id', protect, async (req, res) => {
  await db.query(
    'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId]
  );
  res.json({ message: 'Đã xoá địa chỉ!' });
});

export default router;