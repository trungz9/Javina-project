import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Cart() {
  const navigate = useNavigate()
  const [items, setItems]   = useState([])
  const [total, setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCart = () => {
    api.get('/cart')
      .then(res => { setItems(res.data.items); setTotal(res.data.total) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCart() }, [])

  const updateQty = async (id, quantity) => {
    await api.put(`/cart/${id}`, { quantity })
    fetchCart()
  }

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`)
    fetchCart()
  }

  if (loading) return <p className="text-center mt-20">Đang tải giỏ hàng...</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng ({items.length})</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">Giỏ hàng trống!</p>
          <Link to="/" className="bg-orange-500 text-white px-6 py-2 rounded-xl">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Danh sách sản phẩm */}
          <div className="flex-1 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
                <img
                  src={item.cover_image || 'https://placehold.co/100x100?text=SP'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.shop_name}</p>
                  <p className="text-orange-500 font-bold mt-1">
                    {Number(item.final_price).toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  {/* Điều chỉnh số lượng */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                    >−</button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 mt-2"
                  >Xoá</button>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng tiền */}
          <div className="lg:w-72">
            <div className="bg-white rounded-xl shadow p-5 sticky top-4">
              <h2 className="font-bold text-lg mb-4">Tổng đơn hàng</h2>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Tạm tính:</span>
                <span>{Number(total).toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-500">Phí ship:</span>
                <span className="text-green-500">Miễn phí</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Tổng cộng:</span>
                <span className="text-orange-500 text-lg">
                  {Number(total).toLocaleString('vi-VN')}đ
                </span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
              >
                Thanh toán
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}