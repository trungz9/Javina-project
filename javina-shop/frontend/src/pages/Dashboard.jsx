import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const STATUS_LABEL = {
  pending:'Chờ xác nhận', confirmed:'Đã xác nhận',
  preparing:'Đóng gói', shipping:'Đang giao',
  completed:'Hoàn thành', cancelled:'Đã huỷ',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [shop, setShop]     = useState(null)
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/shops/my'), api.get('/shops/my/stats')])
      .then(([s, st]) => { setShop(s.data.shop); setStats(st.data) })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-center">Đang tải dashboard... 🌸</div>

  const totalRevenue = stats?.revenue7d?.reduce((s, d) => s + Number(d.revenue), 0) || 0

  const STATS = [
    { label:'Sản phẩm',    value: shop?.product_count || 0,                          cls:'stat-card-blue'   },
    { label:'Tổng đơn',    value: shop?.order_count   || 0,                          cls:'stat-card-purple' },
    { label:'Doanh thu 7d',value: `${(totalRevenue/1000).toFixed(0)}K`,              cls:'stat-card-green'  },
    { label:'Đánh giá',    value: `${shop?.rating_avg || 0} ⭐`,                     cls:'stat-card-yellow' },
  ]

  return (
    <div className="page-wide">

      {/* Header */}
      <div className="dashboard-hero">
        <div className="dashboard-avatar">{shop?.shop_name?.[0]}</div>
        <div>
          <div className="dashboard-shop-name">{shop?.shop_name}</div>
          <div className="dashboard-shop-sub">
            {shop?.is_verified ? '✓ Đã xác minh' : 'Chưa xác minh'} •
            Đánh giá: {shop?.rating_avg || 0}/5
          </div>
        </div>
        <Link to="/shop/profile" className="dashboard-edit-btn">Chỉnh sửa shop</Link>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-24">
        {STATS.map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Đơn theo trạng thái */}
      <div className="card mb-24">
        <h2 className="dashboard-section-title">Đơn hàng theo trạng thái</h2>
        <div className="grid-4">
          {stats?.statusCount?.map(s => (
            <Link key={s.status} to={`/manage-orders?status=${s.status}`}
              className="card card-hover text-center">
              <div className="font-bold text-xl">{s.count}</div>
              <div className="text-gray text-xs mt-4">{STATUS_LABEL[s.status]}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top sản phẩm */}
      <div className="card mb-24">
        <div className="flex-between mb-16">
          <h2 className="dashboard-section-title" style={{ margin: 0 }}>Top sản phẩm bán chạy</h2>
          <Link to="/manage-products" className="text-sakura text-sm">Xem tất cả →</Link>
        </div>
        {stats?.topProducts?.length === 0 && (
          <p className="text-gray text-sm">Chưa có sản phẩm nào.</p>
        )}
        {stats?.topProducts?.map((p, i) => (
          <div key={p.id} className="top-product-row">
            <span className="top-product-rank">{i + 1}</span>
            <img src={p.cover_image || 'https://placehold.co/50x50?text=🌸'}
              alt={p.name} className="top-product-img"/>
            <div className="flex-1">
              <p className="top-product-name">{p.name}</p>
              <p className="top-product-sold">Đã bán: {p.sold_qty}</p>
            </div>
            <span className="top-product-price">
              {Number(p.final_price).toLocaleString('vi-VN')}đ
            </span>
          </div>
        ))}
      </div>

      {/* Quick menu */}
      <div className="grid-2">
        <Link to="/manage-products" className="quick-menu-card">
          <div className="quick-menu-icon">📦</div>
          <div className="quick-menu-title">Quản lý sản phẩm</div>
          <div className="quick-menu-sub">Thêm, sửa, xoá sản phẩm</div>
        </Link>
        <Link to="/manage-orders" className="quick-menu-card">
          <div className="quick-menu-icon">🧾</div>
          <div className="quick-menu-title">Quản lý đơn hàng</div>
          <div className="quick-menu-sub">Xác nhận, giao hàng</div>
        </Link>
      </div>

    </div>
  )
}