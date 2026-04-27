// ── COSINE SIMILARITY giữa 2 vector rating ──────────
const cosineSimilarity = (vecA, vecB) => {
  const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)])

  let dot = 0, normA = 0, normB = 0

  for (const k of keys) {
    const a = vecA[k] || 0
    const b = vecB[k] || 0
    dot   += a * b
    normA += a * a
    normB += b * b
  }

  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// ── COLLABORATIVE FILTERING chính ───────────────────
export const getRecommendations = (targetUserId, allRatings, topN = 8) => {

  // allRatings = { userId: { productId: rating, ... }, ... }
  const targetRatings = allRatings[targetUserId]
  if (!targetRatings) return []

  // 1. Tính similarity với tất cả user khác
  const similarities = []
  for (const [userId, ratings] of Object.entries(allRatings)) {
    if (userId == targetUserId) continue

    const sim = cosineSimilarity(targetRatings, ratings)
    if (sim > 0) {
      similarities.push({ userId, sim, ratings })
    }
  }

  // 2. Sắp xếp theo similarity giảm dần
  similarities.sort((a, b) => b.sim - a.sim)

  // 3. Lấy top 10 user giống nhất
  const topNeighbors = similarities.slice(0, 10)

  // 4. Tổng hợp điểm gợi ý cho từng sản phẩm
  const scores = {}
  for (const neighbor of topNeighbors) {
    for (const [productId, rating] of Object.entries(neighbor.ratings)) {
      // Chỉ gợi ý sản phẩm user chưa xem/mua
      if (targetRatings[productId]) continue

      if (!scores[productId]) scores[productId] = 0
      scores[productId] += neighbor.sim * rating
    }
  }

  // 5. Sắp xếp và lấy top N sản phẩm
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([productId]) => Number(productId))
}