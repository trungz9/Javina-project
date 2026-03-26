import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function ProductDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
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

  const handleBuyNow = async () => {
    if (!isLoggedIn) return navigate('/login')
    await handleAddToCart()
    navigate('/cart')
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-500">Đang tải sản phẩm...</p>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-500">{error}</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-orange-500 mb-6 flex items-center gap-1"
      >
        ← Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-8">

        {/* ── Cột trái: Ảnh ── */}
        <div className="md:w-1/2">
          <img
            src={mainImg || 'https://placehold.co/500x400?text=No+Image'}
            alt={product.name}
            className="w-full h-80 object-cover rounded-xl"
          />
          {/* Ảnh phụ */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.images.map(img => (
                <img
                  key={img.id}
                  src={img.image_url}
                  alt=""
                  onClick={() => setMainImg(img.image_url)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2
                    ${mainImg === img.image_url ? 'border-orange-400' : 'border-transparent'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Cột phải: Thông tin ── */}
        <div className="md:w-1/2 flex flex-col gap-4">

          {/* Tên & danh mục */}
          <div>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
              {product.category_name}
            </span>
            <h1 className="text-xl font-bold mt-2">{product.name}</h1>
          </div>

          {/* Giá */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-orange-500">
              {Number(product.final_price).toLocaleString('vi-VN')}đ
            </span>
            {product.discount_pct > 0 && (
              <>
                <span className="text-gray-400 line-through text-sm">
                  {Number(product.base_price).toLocaleString('vi-VN')}đ
                </span>
                <span className="bg-red-100 text-red-500 text-xs px-2 py-0.5 rounded-full">
                  -{product.discount_pct}%
                </span>
              </>
            )}
          </div>

          {/* Thông tin nhanh */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>Tình trạng: <span className="font-medium">
              {{ new: 'Mới', like_new: 'Như mới', used: 'Đã dùng', for_rent: 'Cho thuê' }
                [product.condition_type]}
            </span></div>
            <div>Còn lại: <span className="font-medium">{product.stock_qty} cái</span></div>
            <div>Đã bán: <span className="font-medium">{product.sold_qty}</span></div>
            <div>Lượt xem: <span className="font-medium">{product.view_count}</span></div>
            {product.is_negotiable === 1 && (
              <div className="col-span-2 text-green-600 font-medium">
                Có thể thương lượng giá
              </div>
            )}
          </div>

          {/* Shop */}
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-600">
              {product.shop_name?.[0]}
            </div>
            <div>
              <p className="font-medium text-sm">{product.shop_name}</p>
              <p className="text-xs text-gray-400">
                {product.shop_rating > 0 ? `⭐ ${product.shop_rating}` : 'Chưa có đánh giá'}
              </p>
            </div>
          </div>

          {/* Số lượng */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Số lượng:</span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg"
              >−</button>
              <span className="px-4 py-1 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock_qty, q + 1))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg"
              >+</button>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 border-2 border-orange-500 text-orange-500 font-semibold py-2 rounded-xl hover:bg-orange-50 transition"
            >
              {added ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock_qty === 0}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl transition disabled:opacity-50"
            >
              {product.stock_qty === 0 ? 'Hết hàng' : 'Mua ngay'}
            </button>
          </div>

        </div>
      </div>

      {/* Mô tả sản phẩm */}
      {product.description && (
        <div className="bg-white rounded-2xl shadow p-6 mt-6">
          <h2 className="text-lg font-bold mb-3">Mô tả sản phẩm</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

    </div>
  )
}