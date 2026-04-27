import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });
import { getRecommendations } from '../utils/collaborative.js'

import db from '../../config/db.js';

// ── LẤY DANH SÁCH SẢN PHẨM ───────────────────────
export const getProducts = async (req, res) => {
  try {
    const { category, search, min_price, max_price, limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT p.*, s.shop_name, c.name AS category_name,
             (SELECT image_url FROM product_images
              WHERE product_id = p.id AND is_cover = 1 LIMIT 1) AS cover_image
      FROM products p
      JOIN shops s ON s.id = p.shop_id
      JOIN categories c ON c.id = p.category_id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (category) {
      sql += ' AND p.category_id = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND p.name LIKE ?';
      params.push(`%${search}%`);
    }
    if (min_price) {
      sql += ' AND p.final_price >= ?';
      params.push(min_price);
    }
    if (max_price) {
      sql += ' AND p.final_price <= ?';
      params.push(max_price);
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [products] = await db.query(sql, params);
    res.json({ products });

  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── LẤY CHI TIẾT 1 SẢN PHẨM ─────────────────────
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT p.*, s.shop_name, s.rating_avg AS shop_rating,
             c.name AS category_name
      FROM products p
      JOIN shops s ON s.id = p.shop_id
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = ? AND p.is_active = 1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
    }

    // Lấy ảnh sản phẩm
    const [images] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order',
      [id]
    );

    // Tăng lượt xem
    await db.query('UPDATE products SET view_count = view_count + 1 WHERE id = ?', [id]);

    res.json({ product: { ...rows[0], images } });

  } catch (err) {
    console.error('getProductById error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── TẠO SẢN PHẨM MỚI ────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const {
      name, description, category_id,
      base_price, discount_pct = 0,
      stock_qty, condition_type = 'used',
      is_negotiable = 0
    } = req.body;

    if (!name || !category_id || !base_price || !stock_qty) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin sản phẩm!' });
    }

    let [shops] = await db.query('SELECT id FROM shops WHERE user_id = ?', [req.userId]);

    let shopId;
    if (shops.length === 0) {
      const [userRow] = await db.query('SELECT username FROM users WHERE id = ?', [req.userId]);
      const shopName = `Shop của ${userRow[0].username}`;
      const slug     = `shop-${req.userId}-${Date.now()}`;
      const [newShop] = await db.query(
        'INSERT INTO shops (user_id, shop_name, slug) VALUES (?, ?, ?)',
        [req.userId, shopName, slug]
      );
      shopId = newShop.insertId;
    } else {
      shopId = shops[0].id;
    }

    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    const [result] = await db.query(`
      INSERT INTO products
        (shop_id, category_id, name, slug, description,
         base_price, discount_pct, stock_qty, condition_type, is_negotiable)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [shopId, category_id, name, slug, description,
        base_price, discount_pct, stock_qty, condition_type, is_negotiable]);

    const productId = result.insertId;

    // ✅ THÊM: lưu ảnh vào bảng product_images
    if (req.files && req.files.length > 0) {
      const imageValues = req.files.map((file, index) => [
        productId,
        `/uploads/${file.filename}`,
        index === 0 ? 1 : 0, // ảnh đầu tiên là ảnh bìa (is_cover = 1)
        index                // sort_order
      ]);

      await db.query(
        'INSERT INTO product_images (product_id, image_url, is_cover, sort_order) VALUES ?',
        [imageValues]
      );
    }
    
    const { trie } = await import('../utils/Trie.js')
    trie.insert(name, productId)

    res.status(201).json({
      message: 'Đăng sản phẩm thành công!',
      productId
    });

  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};
// ── CẬP NHẬT SẢN PHẨM ───────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, base_price, discount_pct, stock_qty, is_active } = req.body;

    // Kiểm tra quyền sở hữu
    const [rows] = await db.query(
      'SELECT p.id FROM products p JOIN shops s ON s.id = p.shop_id WHERE p.id = ? AND s.user_id = ?',
      [id, req.userId]
    );
    if (rows.length === 0) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa sản phẩm này!' });
    }

    await db.query(`
      UPDATE products SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        base_price = COALESCE(?, base_price),
        discount_pct = COALESCE(?, discount_pct),
        stock_qty = COALESCE(?, stock_qty),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `, [name, description, base_price, discount_pct, stock_qty, is_active, id]);

    res.json({ message: 'Cập nhật sản phẩm thành công!' });

  } catch (err) {
    console.error('updateProduct error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── XOÁ SẢN PHẨM ────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra quyền sở hữu
    const [rows] = await db.query(
      'SELECT p.id FROM products p JOIN shops s ON s.id = p.shop_id WHERE p.id = ? AND s.user_id = ?',
      [id, req.userId]
    );
    if (rows.length === 0) {
      return res.status(403).json({ message: 'Bạn không có quyền xoá sản phẩm này!' });
    }

    // Ẩn sản phẩm thay vì xoá hẳn
    await db.query('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
    res.json({ message: 'Xoá sản phẩm thành công!' });

  } catch (err) {
    console.error('deleteProduct error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};
// ── AUTOCOMPLETE bằng TRIE ───────────────────────────
export const searchAutocomplete = async (req, res) => {
  try {
    const { q } = req.query
    if (!q || q.trim().length < 1) {
      return res.json({ suggestions: [] })
    }

    // 1. Tìm productId trong Trie — O(m) với m = độ dài prefix
    const { trie } = await import('../utils/Trie.js')
    const productIds = trie.search(q.trim(), 8)

    if (productIds.length === 0) {
      return res.json({ suggestions: [] })
    }

    // 2. Lấy thông tin sản phẩm từ DB
    const placeholders = productIds.map(() => '?').join(',')
    const [products] = await db.query(
      `SELECT id, name, base_price, 
              (SELECT image_url FROM product_images 
               WHERE product_id = p.id AND is_cover = 1 LIMIT 1) AS cover_image
       FROM products p
       WHERE id IN (${placeholders}) AND is_active = 1`,
      productIds
    )

    res.json({ suggestions: products })

  } catch (err) {
    console.error('autocomplete error:', err)
    res.status(500).json({ suggestions: [] })
  }
}

// ── GỢI Ý SẢN PHẨM CHO USER ─────────────────────────
export const getRecommendedProducts = async (req, res) => {
  try {
    const userId = req.userId

    // 1. Lấy dữ liệu từ user_interactions
    const [interactions] = await db.query(`
      SELECT user_id, product_id, score
      FROM user_interactions
    `)

    // 2. Chuyển thành { userId: { productId: score } }
    const allScores = {}
    for (const row of interactions) {
      if (!allScores[row.user_id]) allScores[row.user_id] = {}
      allScores[row.user_id][row.product_id] = row.score
    }

    // 3. Fallback: chưa có dữ liệu → trả về sản phẩm phổ biến
    if (!allScores[userId]) {
      const [popular] = await db.query(`
        SELECT p.id, p.name, p.base_price,
               COALESCE(AVG(r.rating), 0) AS avg_rating,
               (SELECT image_url FROM product_images
                WHERE product_id = p.id AND is_cover = 1 LIMIT 1) AS cover_image
        FROM products p
        LEFT JOIN reviews r ON r.product_id = p.id
        WHERE p.is_active = 1
        GROUP BY p.id
        ORDER BY avg_rating DESC
        LIMIT 8
      `)
      return res.json({ products: popular, method: 'popular' })
    }

    // 4. Chạy Collaborative Filtering
    const recommendedIds = getRecommendations(userId, allScores)

    // 5. Fallback: không tìm được gợi ý → trả về phổ biến
    if (!recommendedIds || recommendedIds.length === 0) {
      const [popular] = await db.query(`
        SELECT p.id, p.name, p.base_price,
               COALESCE(AVG(r.rating), 0) AS avg_rating,
               (SELECT image_url FROM product_images
                WHERE product_id = p.id AND is_cover = 1 LIMIT 1) AS cover_image
        FROM products p
        LEFT JOIN reviews r ON r.product_id = p.id
        WHERE p.is_active = 1
        GROUP BY p.id
        ORDER BY avg_rating DESC
        LIMIT 8
      `)
      return res.json({ products: popular, method: 'popular' })
    }

    // 6. Lấy thông tin sản phẩm từ DB
    const placeholders = recommendedIds.map(() => '?').join(',')
    const [products] = await db.query(`
      SELECT p.id, p.name, p.base_price,
             c.name AS category_name,
             (SELECT image_url FROM product_images
              WHERE product_id = p.id AND is_cover = 1 LIMIT 1) AS cover_image
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.id IN (${placeholders}) AND p.is_active = 1
    `, recommendedIds)

    res.json({ products, method: 'collaborative' })

  } catch (err) {
    console.error('recommendation error:', err)
    res.status(500).json({ message: 'Lỗi server!' })
  }
}