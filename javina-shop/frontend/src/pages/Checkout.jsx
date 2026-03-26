import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Checkout() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal]         = useState(0)
  const [addresses, setAddresses] = useState([])
  const [addressId, setAddressId] = useState('')
  const [note, setNote]           = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    api.get('/cart').then(res => {
      setCartItems(res.data.items)
      setTotal(res.data.total)
    })
    api.get('/addresses').then(res => {
      setAddresses(res.data.addresses)
      const def = res.data.addresses.find(a => a.is_default)
      if (def) setAddressId(def.id)
    }).catch(() => {})
  }, [])

  const handleOrder = async () => {
    if (!addressId) return setError('Vui lòng chọn địa chỉ giao hàng!')
    if (cartItems.length === 0) return setError('Giỏ hàng trống!')
    setLoading(true)
    setError('')
    try {
      const items = cartItems.map(i => ({
        product_id: i.product_id,
        quantity:   i.quantity,
        unit_price: i.final_price
      }))
      const res = await api.post('/orders', {
        address_id: addressId,
        note,
        shipping_fee: 0,
        items
      })
      navigate(`/order-success/${res.data.order_id}`, {
        state: { order_code: res.data.order_code, total: res.data.total_amount }
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Đặt hàng thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Xác nhận đơn hàng</h1>

      {error && (
        <p className="text-red-500 bg-red-50 px-4 py-2 rounded-lg mb-4 text-sm">{error}</p>
      )}

      {/* Địa chỉ giao hàng */}
      <div className="bg-white rounded-xl shadow p-5 mb-4">
        <h2 className="font-bold mb-3">Địa chỉ giao hàng</h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-gray-500">
            Chưa có địa chỉ.{' '}
            <button
              onClick={() => navigate('/profile')}
              className="text-orange-500 underline"
            >Thêm địa chỉ</button>
          </p>
        ) : (
          <div className="space-y-2">
            {addresses.map(addr => (
              <label key={addr.id}
                className={`flex gap-3 p-3 rounded-xl border-2 cursor-pointer transition
                  ${addressId === addr.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}
              >
                <input
                  type="radio" name="address"
                  value={addr.id}
                  checked={addressId === addr.id}
                  onChange={() => setAddressId(addr.id)}
                  className="mt-1 accent-orange-500"
                />
                <div className="text-sm">
                  <p className="font-medium">{addr.recipient} — {addr.phone}</p>
                  <p className="text-gray-500">{addr.address}, {addr.ward}, {addr.district}, {addr.province}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sản phẩm đặt mua */}
      <div className="bg-white rounded-xl shadow p-5 mb-4">
        <h2 className="font-bold mb-3">Sản phẩm ({cartItems.length})</h2>
        <div className="space-y-3">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div className="flex gap-3 items-center">
                <img
                  src={item.cover_image || 'https://placehold.co/50x50?text=SP'}
                  className="w-12 h-12 rounded-lg object-cover"
                  alt={item.name}
                />
                <div>
                  <p className="font-medium line-clamp-1">{item.name}</p>
                  <p className="text-gray-400">x{item.quantity}</p>
                </div>
              </div>
              <p className="font-medium text-orange-500">
                {(Number(item.final_price) * item.quantity).toLocaleString('vi-VN')}đ
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ghi chú */}
      <div className="bg-white rounded-xl shadow p-5 mb-4">
        <h2 className="font-bold mb-2">Ghi chú cho người bán</h2>
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="VD: Giao giờ hành chính, để trước cửa phòng..."
          rows={2}
          className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>

      {/* Tổng tiền & Đặt hàng */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-500">Tạm tính:</span>
          <span>{Number(total).toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="flex justify-between mb-4 text-sm">
          <span className="text-gray-500">Phí ship:</span>
          <span className="text-green-500">Miễn phí</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-3 mb-4">
          <span>Tổng cộng:</span>
          <span className="text-orange-500">{Number(total).toLocaleString('vi-VN')}đ</span>
        </div>
        <p className="text-xs text-gray-400 mb-3 text-center">
          Phương thức thanh toán: Tiền mặt khi nhận hàng (COD)
        </p>
        <button
          onClick={handleOrder} disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
      </div>
    </div>
  )
}