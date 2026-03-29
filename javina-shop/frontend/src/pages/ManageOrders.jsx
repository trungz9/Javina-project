import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'

const STATUS_FLOW = {
  pending:   { next:'confirmed', label:'Chờ xác nhận',   cls:'status-pending'   },
  confirmed: { next:'preparing', label:'Đã xác nhận',    cls:'status-confirmed' },
  preparing: { next:'shipping',  label:'Đang đóng gói',  cls:'status-preparing' },
  shipping:  { next:'delivered', label:'Đang giao',      cls:'status-shipping'  },
  delivered: { next:'completed', label:'Đã nhận',        cls:'status-delivered' },
  completed: { next: null,       label:'Hoàn thành',     cls:'status-completed' },
  cancelled: { next: null,       label:'Đã huỷ',         cls:'status-cancelled' },
}

const NEXT_LABEL = {
  confirmed:'Xác nhận đơn', preparing:'Bắt đầu đóng gói',
  shipping:'Giao cho ship',  delivered:'Xác nhận đã giao',
  completed:'Hoàn thành',
}

const TABS = [
  { value:'',          label:'Tất cả'       },
  { value:'pending',   label:'Chờ xác nhận' },
  { value:'confirmed', label:'Đã xác nhận'  },
  { value:'preparing', label:'Đóng gói'     },
  { value:'shipping',  label:'Đang giao'    },
  { value:'completed', label:'Hoàn thành'   },
  { value:'cancelled', label:'Đã huỷ'       },
]

export default function ManageOrders() {
  const [searchParams]        = useSearchParams()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState(searchParams.get('status') || '')

  const fetchOrders = () => {
    const url = filter ? `/shops/my/orders?status=${filter}` : '/shops/my/orders'
    api.get(url)
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetchOrders() }, [filter])

  const handleUpdate = async (id, next) => {
    if (!confirm(`Chuyển sang: "${NEXT_LABEL[next]}"?`)) return
    try {
      await api.put(`/shops/my/orders/${id}`, { status: next })
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật thất bại!')
    }
  }

  return (
    <div className="page-medium">
      <h1 className="font-jp text-xl font-bold mb-24">🧾 Quản lý đơn hàng</h1>

      {/* Tabs */}
      <div className="status-tabs">
        {TABS.map(tab => (
          <button key={tab.value} onClick={() => setFilter(tab.value)}
            className={`status-tab ${filter === tab.value ? 'status-tab-active' : 'status-tab-inactive'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧾</div>
          <p className="empty-state-text">Không có đơn hàng nào!</p>
        </div>
      ) : (
        <div className="flex-col gap-16">
          {orders.map(order => {
            const s = STATUS_FLOW[order.status] || {}
            return (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <p className="order-code">{order.order_code}</p>
                    <p className="order-shop">{order.buyer_name} — {order.buyer_phone}</p>
                    <p className="text-xs text-gray mt-4">
                      {order.address}, {order.ward}, {order.district}, {order.province}
                    </p>
                  </div>
                  <span className={`order-status badge ${s.cls}`}>{s.label}</span>
                </div>

                <div className="order-footer">
                  <div className="text-sm text-gray">
                    {order.item_count} sản phẩm •
                    <span className="order-amount" style={{ marginLeft: 6 }}>
                      {Number(order.total_amount).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  {s.next && (
                    <button onClick={() => handleUpdate(order.id, s.next)}
                      className="btn btn-primary btn-sm">
                      {NEXT_LABEL[s.next]}
                    </button>
                  )}
                </div>

                {order.note && (
                  <div className="order-note">Ghi chú: {order.note}</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}