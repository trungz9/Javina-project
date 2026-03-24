import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../config/db.js';

import dotenv from 'dotenv';
dotenv.config();

// Tạo JWT token
const signToken = (id) => jwt.sign(
  { id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// ── ĐĂNG KÝ ──────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { username, email, password, full_name, university } = req.body;

    // 1. Kiểm tra thiếu thông tin
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    // 2. Kiểm tra email đã tồn tại chưa
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email hoặc username đã được sử dụng!' });
    }

    // 3. Mã hoá mật khẩu
    const password_hash = await bcrypt.hash(password, 12);

    // 4. Lưu vào database
    const [result] = await db.query(
      `INSERT INTO users (username, email, password_hash, full_name, university)
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, password_hash, full_name, university || null]
    );

    // 5. Tạo token và trả về
    const token = signToken(result.insertId);
    res.status(201).json({
      message: 'Đăng ký thành công!',
      token,
      user: { id: result.insertId, username, email, full_name }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── ĐĂNG NHẬP ────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kiểm tra thiếu thông tin
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu!' });
    }

    // 2. Tìm user trong DB
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Email không tồn tại!' });
    }

    // 3. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không đúng!' });
    }

    // 4. Tạo token và trả về
    const token = signToken(user.id);
    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── LẤY THÔNG TIN BẢN THÂN ───────────────────────
export const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, full_name, avatar_url, university FROM users WHERE id = ?',
      [req.userId]
    );
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!' });
  }
};