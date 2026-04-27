// backend/src/utils/scoring.js

// Trọng số từng hành vi
const WEIGHTS = {
  view:    1,   // xem sản phẩm
  cart:    2,   // thêm vào giỏ
  purchase: 3,  // mua hàng
  // rating được tính riêng bên dưới
}

// ── Tính điểm tổng hợp 1 cặp (user, product) ────────
export const calcScore = ({
  viewCount   = 0,
  inCart      = false,
  purchased   = false,
  rating      = null,   // null = chưa đánh giá
}) => {
  let score = 0

  score += Math.min(viewCount, 5) * WEIGHTS.view  // xem tối đa 5 lần tính điểm
  if (inCart)    score += WEIGHTS.cart
  if (purchased) score += WEIGHTS.purchase
  if (rating)    score += rating                   // 1-5 sao cộng thẳng

  return score
}