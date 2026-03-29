import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const CONDITION_LABEL = {
  new:'Mới', like_new:'Như mới', used:'Đã dùng', for_rent:'Cho thuê'
}

export default function ProductDetail() {
  const { id }         = useParams()
  const navigate       = useNavigate()
  const { isLoggedIn } = useAuth()
  const [product, setProduct]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [mainImg, setMainImg]   = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded]       = useState(false)

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data.product)
        const cover = res.data.product.images?.find(i => i.is_cover)
        setMainImg(cover?.image_url || res.data.product.images?.[0]?.image_url || '')
      })
      .catch(() => setError('Không tìm thấy sản phẩm!'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!isLoggedIn) return navigate('/login')
    try {
      await api.post('/cart', { product_id: id, quantity })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi thêm vào giỏ!')
    }
  }

  if (loading) return <div className="loading-center">Đang tải sản phẩm... 🌸</div>
  if (error)   return <div className="loading-center" style={{ color: '#E05555' }}>{error}</div>

  return (
    <div className="detail-page">
      <button onClick={() => navigate(-1)} className="detail-back">← Quay lại</button>

      <div className="detail-card flex gap-24" style={{ flexWrap: 'wrap' }}>

        {/* Ảnh */}
        <div style={{ flex: '1 1 300px' }}>
          <img
            src={mainImg || 'https://placehold.co/500x400?text=🌸'}
            alt={product.name} className="detail-img-main"
          />
          {product.images?.length > 1 && (
            <div className="detail-img-list">
              {product.images.map(img => (
                <img key={img.id} src={img.image_url} alt=""
                  onClick={() => setMainImg(img.image_url)}
                  className={`detail-img-thumb ${mainImg === img.image_url ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thông tin */}
        <div style={{ flex: '1 1 280px' }} className="flex-col gap-16">
          <div>
            <span className="detail-cat-badge">{product.category_name}</span>
            <h1 className="detail-title">{product.name}</h1>
          </div>

          <div className="flex" style={{ alignItems: 'center' }}>
            <span className="detail-price">
              {Number(product.final_price).toLocaleString('vi-VN')}đ
            </span>
            {product.discount_pct > 0 && (
              <>
                <span className="detail-price-old">
                  {Number(product.base_price).toLocaleString('vi-VN')}đ
                </span>
                <span className="badge badge-red" style={{ marginLeft: 8 }}>
                  -{product.discount_pct}%
                </span>
              </>
            )}
          </div>

          <div className="detail-info-grid">
            <div>Tình trạng: <strong>{CONDITION_LABEL[product.condition_type]}</strong></div>
            <div>Còn lại: <strong>{product.stock_qty} cái</strong></div>
            <div>Đã bán: <strong>{product.sold_qty}</strong></div>
            <div>Lượt xem: <strong>{product.view_count}</strong></div>
            {product.is_negotiable === 1 && (
              <div className="badge badge-matcha" style={{ gridColumn: 'span 2' }}>
                ✓ Có thể thương lượng giá
              </div>
            )}
          </div>

          {/* Shop */}
          <div className="detail-shop-card">
            <div className="detail-shop-avatar">
              {product.shop_name?.[0]}
            </div>
            <div>
              <p className="font-medium">{product.shop_name}</p>
              <p className="text-gray text-xs">
                {product.shop_rating > 0 ? `⭐ ${product.shop_rating}` : 'Chưa có đánh giá'}
              </p>
            </div>
          </div>

          {/* Số lượng */}
          <div className="flex gap-12" style={{ alignItems: 'center' }}>
            <span className="text-gray text-sm">Số lượng:</span>
            <div className="detail-qty-control">
              <button className="detail-qty-btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span className="detail-qty-num">{quantity}</span>
              <button className="detail-qty-btn"
                onClick={() => setQuantity(q => Math.min(product.stock_qty, q + 1))}>+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <button onClick={handleAddToCart} className="btn btn-secondary flex-1">
              {added ? '✓ Đã thêm!' : '🛒 Thêm vào giỏ'}
            </button>
            <button
              onClick={() => { handleAddToCart(); navigate('/cart') }}
              disabled={product.stock_qty === 0}
              className="btn btn-primary flex-1">
              {product.stock_qty === 0 ? 'Hết hàng' : '⚡ Mua ngay'}
            </button>
          </div>
        </div>
      </div>

      {/* Mô tả */}
      {product.description && (
        <div className="detail-desc-card">
          <h2 className="detail-desc-title">Mô tả sản phẩm</h2>
          <p className="detail-desc-body">{product.description}</p>
        </div>
      )}
    </div>
  )
}