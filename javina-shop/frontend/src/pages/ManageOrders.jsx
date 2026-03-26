import { useEffect, useState } from 'react'
import api from '../api/axios'

const STATUS_NEXT = {
  pending:   { next: 'confirmed', label: 'Xác nhận đơn'  },
  confirmed: { next: 'preparing', label: 'Bắt đầu đóng gói' },
  preparing: { next: 'shipping',  label: 'Giao cho ship'  },
  shipping:  { next: 'delivered', label: 'Xác nhận đã giao' },
  delivered: { next: 'completed', label: 'Hoàn thành'     },
}

const STATUS_COLOR = {
  pending:   'bg-yellow-100 text-yellow-600',
  confirmed: 'bg-blue-100 text-blue-600',
  preparing: 'bg-purple-100 text-purple-600',
  shipping:  'bg-indigo-100 text-indigo-600',
  delivered: 'bg-teal-100 text-teal-600',
  completed: 'bg-green-100 text-green-600',
  cancelled: 'bg-red-100 text-red-500',
}

const STATUS_LABEL = {
  pending:   'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang đóng gói',
  shipping:  'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã huỷ',
}

export default function ManageOrders() {
  const [orders, setOrders]     = useState([])
  const [filter, setFilter]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchOrders = (status = '') => {
    setLoading(true)
    api.get(`/shop/orders${status ? `?status=${status}` : ''}`)
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders(filter) }, [filter])

  const handleUpdateStatus = async (id, nextStatus) => {
    setUpdating(id)
    try {
      await api.put(`/shop/orders/${id}`, { status: nextStatus })
      setOrders(prev => prev.map(o =>
        o.id === id ? { ...o, status: nextStatus } : o
      ))
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật thất bại!')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: '',          label: 'Tất cả'       },
          { value: 'pending',   label: 'Chờ xác nhận' },
          { value: 'confirmed', label: 'Đã xác nhận'  },
          { value: 'preparing', label: 'Đóng gói'     },
          { value: 'shipping',  label: 'Đang giao'    },
          { value: 'completed', label: 'Hoàn thành'   },
          { value: 'cancelled', label: 'Đã huỷ'       },
        ].map(tab => (
          <button key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition
              ${filter === tab.value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-20 text-gray-400">Đang tải...</p>
      ) : orders.length === 0 ? (
        <p className="text-center py-20 text-gray-400">Không có đơn hàng nào!</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow p-5">

              {/* Header đơn hàng */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-base">{order.order_code}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {order.buyer_name} — {order.buyer_phone}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.address}, {order.ward}, {order.district}, {order.province}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLOR[order.status]}`}>
                  {STATUS_LABEL[order.status]}
                </span>
              </div>

              {/* Thông tin đơn */}
              <div className="flex justify-between items-center text-sm border-t pt-3">
                <div className="text-gray-500">
                  <span>{order.item_count} sản phẩm</span>
                  {order.note && (
                    <span className="ml-3 italic">"{order.note}"</span>
                  )}
                </div>
                <p className="font-bold text-orange-500 text-base">
                  {Number(order.total_amount).toLocaleString('vi-VN')}đ
                </p>
              </div>

              {/* Nút cập nhật trạng thái */}
              {STATUS_NEXT[order.status] && (
                <button
                  onClick={() => handleUpdateStatus(order.id, STATUS_NEXT[order.status].next)}
                  disabled={updating === order.id}
                  className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 rounded-xl transition disabled:opacity-50"
                >
                  {updating === order.id ? 'Đang cập nhật...' : STATUS_NEXT[order.status].label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}