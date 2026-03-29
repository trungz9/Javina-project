import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Cart() {
  const navigate = useNavigate()
  const [items, setItems]     = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCart = () => {
    api.get('/cart')
      .then(res => { setItems(res.data.items); setTotal(res.data.total) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetchCart() }, [])

  const updateQty   = async (id, qty) => { await api.put(`/cart/${id}`, { quantity: qty }); fetchCart() }
  const removeItem  = async (id)      => { await api.delete(`/cart/${id}`); fetchCart() }

  if (loading) return <div className="loading-center">Đang tải giỏ hàng... 🛒</div>

  return (
    <div className="cart-page">
      <h1 className="cart-title">🛒 Giỏ hàng ({items.length})</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <p className="empty-state-text">Giỏ hàng trống!</p>
          <Link to="/" className="btn btn-primary">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="flex gap-24" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Items */}
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
                  <p className="cart-item-price">
                    {Number(item.final_price).toLocaleString('vi-VN')}đ
                  </p>
                </div>
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

          {/* Summary */}
          <div className="cart-summary" style={{ width: 280 }}>
            <h2 className="cart-summary-title">Tổng đơn hàng</h2>
            <div className="cart-summary-row">
              <span className="cart-summary-label">Tạm tính:</span>
              <span>{Number(total).toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="cart-summary-row">
              <span className="cart-summary-label">Phí ship:</span>
              <span className="cart-summary-free">Miễn phí</span>
            </div>
            <div className="cart-summary-total">
              <span>Tổng cộng:</span>
              <span className="cart-summary-amount">
                {Number(total).toLocaleString('vi-VN')}đ
              </span>
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