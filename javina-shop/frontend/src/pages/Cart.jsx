import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Cart() {
  const navigate = useNavigate()
  const [items, setItems]     = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState('VND') // 👈 thêm
  const [rate, setRate]         = useState(null)  // 👈 thêm

  const fetchCart = () => {
    api.get('/cart')
      .then(res => { setItems(res.data.items); setTotal(res.data.total) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  // 👈 Lấy tỷ giá khi trang load
  useEffect(() => {
    api.get('/currency/current')
      .then(res => setRate(res.data.rate))
      .catch(() => {})
  }, [])

  useEffect(() => { fetchCart() }, [])

  const updateQty  = async (id, qty) => { await api.put(`/cart/${id}`, { quantity: qty }); fetchCart() }
  const removeItem = async (id)      => { await api.delete(`/cart/${id}`); fetchCart() }

  // 👈 Hàm chuyển đổi giá
  const formatPrice = (priceVnd) => {
    if (currency === 'JPY' && rate) {
      const jpy = Math.round(Number(priceVnd) * parseFloat(rate.vnd_to_jpy))
      return `¥${jpy.toLocaleString('ja-JP')}`
    }
    return `${Number(priceVnd).toLocaleString('vi-VN')}đ`
  }

  const formatTotal = (totalVnd) => {
    if (currency === 'JPY' && rate) {
      const jpy = Math.round(Number(totalVnd) * parseFloat(rate.vnd_to_jpy))
      return `¥${jpy.toLocaleString('ja-JP')}`
    }
    return `${Number(totalVnd).toLocaleString('vi-VN')}đ`
  }

  if (loading) return <div className="loading-center">Đang tải giỏ hàng... 🛒</div>

  return (
    <div className="cart-page">

      {/* Header + nút đổi tiền tệ */}
      <div className="flex-between mb-24" style={{ flexWrap: 'wrap', gap: 12 }}>
        <h1 className="cart-title" style={{ margin: 0 }}>
          🛒 Giỏ hàng ({items.length})
        </h1>

        {/* 👈 Nút đổi VND / JPY */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {rate && (
            <span style={{ fontSize: 12, color: '#aaa' }}>
              ¥1 = {Number(rate.jpy_to_vnd).toLocaleString('vi-VN')}đ
            </span>
          )}
          <div style={{
            display: 'flex', borderRadius: 20, overflow: 'hidden',
            border: '1.5px solid var(--sakura-light)',
          }}>
            <button onClick={() => setCurrency('VND')} style={{
              padding: '6px 16px', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: currency === 'VND' ? 'var(--sakura-dark)' : '#fff',
              color:      currency === 'VND' ? '#fff' : '#888',
            }}>
              🇻🇳 VNĐ
            </button>
            <button onClick={() => setCurrency('JPY')} style={{
              padding: '6px 16px', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: currency === 'JPY' ? '#E8402A' : '#fff',
              color:      currency === 'JPY' ? '#fff' : '#888',
            }}>
              🇯🇵 JPY
            </button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <p className="empty-state-text">Giỏ hàng trống!</p>
          <Link to="/" className="btn btn-primary">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="flex gap-24" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Danh sách sản phẩm */}
          <div className="flex-1 flex-col gap-16" style={{ minWidth: 280 }}>
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.cover_image || 'https://placehold.co/100x100?text=🌸'}
                  alt={item.name} className="cart-item-img"
                />
                <div className="flex-1">
                  <p className="cart-item-name line-clamp-2">{item.name}</p>
                  <p className="cart-item-shop">🏪 {item.shop_name}</p>

                  {/* 👈 Giá thay đổi theo currency */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <p className="cart-item-price">
                      {formatPrice(item.final_price)}
                    </p>
                    {/* Giá phụ bên cạnh */}
                    {rate && (
                      <p style={{ fontSize: 11, color: '#bbb' }}>
                        {currency === 'VND'
                          ? `≈ ¥${Math.round(Number(item.final_price) * parseFloat(rate.vnd_to_jpy)).toLocaleString()}`
                          : `≈ ${Number(item.final_price).toLocaleString('vi-VN')}đ`
                        }
                      </p>
                    )}
                  </div>

                  {/* Tổng tiền của dòng */}
                  <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                    Tổng: <strong style={{ color: 'var(--sakura-dark)' }}>
                      {formatPrice(Number(item.final_price) * item.quantity)}
                    </strong>
                  </p>
                </div>

                {/* Điều chỉnh số lượng */}
                <div className="flex-col" style={{ alignItems: 'flex-end', gap: 8 }}>
                  <div className="cart-item-qty">
                    <button className="cart-item-qty-btn"
                      onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                    <span className="cart-item-qty-num">{item.quantity}</span>
                    <button className="cart-item-qty-btn"
                      onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="cart-item-remove"
                    onClick={() => removeItem(item.id)}>Xoá</button>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng tiền */}
          <div className="cart-summary" style={{ width: 280 }}>
            <h2 className="cart-summary-title">Tổng đơn hàng</h2>

            {/* Hiển thị tỷ giá đang dùng */}
            {rate && (
              <div style={{
                background: currency === 'JPY' ? '#FFF4F0' : 'var(--sakura-light)',
                borderRadius: 10, padding: '8px 12px', marginBottom: 12,
                fontSize: 12, textAlign: 'center',
              }}>
                {currency === 'JPY' ? (
                  <span style={{ color: '#E8402A', fontWeight: 600 }}>
                    🇯🇵 Hiển thị theo JPY
                  </span>
                ) : (
                  <span style={{ color: 'var(--sakura-dark)', fontWeight: 600 }}>
                    🇻🇳 Hiển thị theo VNĐ
                  </span>
                )}
                <br/>
                <span style={{ color: '#aaa' }}>
                  ¥1 = {Number(rate.jpy_to_vnd).toLocaleString('vi-VN')}đ
                </span>
              </div>
            )}

            <div className="cart-summary-row">
              <span className="cart-summary-label">Tạm tính:</span>
              <span style={{ fontWeight: 600 }}>{formatTotal(total)}</span>
            </div>

            {/* Hiển thị cả 2 loại tiền */}
            {rate && (
              <div className="cart-summary-row">
                <span className="cart-summary-label" style={{ fontSize: 11 }}>
                  {currency === 'VND' ? '≈ JPY:' : '≈ VNĐ:'}
                </span>
                <span style={{ fontSize: 12, color: '#aaa' }}>
                  {currency === 'VND'
                    ? `¥${Math.round(Number(total) * parseFloat(rate.vnd_to_jpy)).toLocaleString()}`
                    : `${Number(total).toLocaleString('vi-VN')}đ`
                  }
                </span>
              </div>
            )}

            <div className="cart-summary-row">
              <span className="cart-summary-label">Phí ship:</span>
              <span className="cart-summary-free">Miễn phí</span>
            </div>

            <div className="cart-summary-total">
              <span>Tổng cộng:</span>
              <span className="cart-summary-amount">{formatTotal(total)}</span>
            </div>

            <button onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-full mt-16">
              🌸 Thanh toán
            </button>
          </div>

        </div>
      )}
    </div>
  )
}