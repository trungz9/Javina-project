import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const STATUS_LABEL = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-600' },
  confirmed: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-600'   },
  preparing: { label: 'Đang đóng gói',color: 'bg-purple-100 text-purple-600'},
  shipping:  { label: 'Đang giao',    color: 'bg-indigo-100 text-indigo-600'},
  delivered: { label: 'Đã nhận',      color: 'bg-teal-100 text-teal-600'   },
  completed: { label: 'Hoàn thành',   color: 'bg-green-100 text-green-600' },
  cancelled: { label: 'Đã huỷ',       color: 'bg-red-100 text-red-500'     },
  refunded:  { label: 'Hoàn tiền',    color: 'bg-gray-100 text-gray-500'   },
}

export default function MyOrders() {
  const navigate = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!confirm('Bạn có chắc muốn huỷ đơn này không?')) return
    try {
      await api.put(`/orders/${id}/cancel`, { cancel_reason: 'Người mua huỷ' })
      setOrders(prev => prev.map(o =>
        o.id === id ? { ...o, status: 'cancelled' } : o
      ))
    } catch (err) {
      alert(err.response?.data?.message || 'Huỷ thất bại!')
    }
  }

  if (loading) return <p className="text-center mt-20">Đang tải đơn hàng...</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">Chưa có đơn hàng nào!</p>
          <button onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-xl">
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const s = STATUS_LABEL[order.status] || {}
            return (
              <div key={order.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold">{order.order_code}</p>
                    <p className="text-xs text-gray-400">{order.shop_name}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.color}`}>
                    {s.label}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-gray-500">{order.item_count} sản phẩm</p>
                  <p className="font-bold text-orange-500">
                    {Number(order.total_amount).toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="flex-1 border border-gray-300 text-sm py-1.5 rounded-lg hover:bg-gray-50"
                  >
                    Xem chi tiết
                  </button>
                  {['pending','confirmed'].includes(order.status) && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="flex-1 border border-red-300 text-red-500 text-sm py-1.5 rounded-lg hover:bg-red-50"
                    >
                      Huỷ đơn
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}