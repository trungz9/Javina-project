import db from '../../config/db.js'
import { calcScore } from '../utils/scoring.js'

// ── HÀM CẬP NHẬT ĐIỂM TỔNG HỢP ─────────────────────
const updateInteractionScore = async (userId, productId) => {
  // Lấy toàn bộ dữ liệu hành vi của cặp (user, product)
  const [[view]]     = await db.query(
    'SELECT view_count FROM view_history WHERE user_id=? AND product_id=?',
    [userId, productId]
  )
  const [[cart]] = await db.query(
    'SELECT id FROM cart_items WHERE user_id=? AND product_id=?',
    [userId, productId]
  )
  const [[purchase]] = await db.query(
    `SELECT oi.id FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.buyer_id=? AND oi.product_id=?
     LIMIT 1`,
    [userId, productId]
  )
  const [[review]]   = await db.query(
    'SELECT rating FROM reviews WHERE user_id=? AND product_id=?',
    [userId, productId]
  )

  const score = calcScore({
    viewCount:  view?.view_count || 0,
    inCart:     !!cart,
    purchased:  !!purchase,
    rating:     review?.rating || null,
  })

  // Upsert vào bảng user_interactions
  await db.query(`
    INSERT INTO user_interactions (user_id, product_id, score)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE score = ?, updated_at = NOW()
  `, [userId, productId, score, score])
}

// ── GHI LẠI LƯỢT XEM ────────────────────────────────
export const trackView = async (req, res) => {
  try {
    const userId    = req.userId
    const productId = req.params.id

    // Upsert view_history — tăng view_count nếu đã xem rồi
    await db.query(`
      INSERT INTO view_history (user_id, product_id, view_count)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE
        view_count  = view_count + 1,
        last_viewed = NOW()
    `, [userId, productId])

    // Cập nhật điểm tổng hợp
    await updateInteractionScore(userId, productId)

    res.json({ success: true })
  } catch (err) {
    console.error('trackView error:', err)
    res.status(500).json({ message: 'Lỗi server!' })
  }
}

// ── LẤY LỊCH SỬ XEM CỦA USER ────────────────────────
export const getViewHistory = async (req, res) => {
  try {
    const userId = req.userId

    const [history] = await db.query(`
      SELECT p.id, p.name, p.base_price,
             vh.view_count, vh.last_viewed,
             (SELECT image_url FROM product_images
              WHERE product_id = p.id AND is_cover = 1 LIMIT 1) AS cover_image
      FROM view_history vh
      JOIN products p ON p.id = vh.product_id
      WHERE vh.user_id = ?
      ORDER BY vh.last_viewed DESC
      LIMIT 20
    `, [userId])

    res.json({ history })
  } catch (err) {
    console.error('getViewHistory error:', err)
    res.status(500).json({ message: 'Lỗi server!' })
  }
}