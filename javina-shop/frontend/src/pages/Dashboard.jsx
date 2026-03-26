import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Dashboard() {
  const { isLoggedIn }  = useAuth()
  const navigate        = useNavigate()
  const [shop, setShop] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) return navigate('/login')
    Promise.all([
      api.get('/shop'),
      api.get('/shop/stats')
    ]).then(([shopRes, statsRes]) => {
      setShop(shopRes.data.shop)
      setStats(statsRes.data.summary)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [isLoggedIn])

  if (loading) return <p className="text-center mt-20">Đang tải...</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard — {shop?.shop_name}</h1>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Chờ xác nhận', value: stats?.pending_count   || 0, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Đang giao',    value: stats?.shipping_count  || 0, color: 'bg-blue-50 text-blue-600'    },
          { label: 'Hoàn thành',   value: stats?.completed_count || 0, color: 'bg-green-50 text-green-600'  },
          { label: 'Doanh thu',
            value: Number(stats?.total_revenue || 0).toLocaleString('vi-VN') + 'đ',
            color: 'bg-orange-50 text-orange-600' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <p className="text-xs opacity-70 mb-1">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Menu nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Quản lý sản phẩm', desc: 'Xem, sửa, xoá sản phẩm',  to: '/manage-products', color: 'border-purple-200 hover:border-purple-400' },
          { title: 'Quản lý đơn hàng', desc: 'Xác nhận và cập nhật đơn', to: '/manage-orders',   color: 'border-blue-200 hover:border-blue-400'   },
          { title: 'Thông tin shop',    desc: 'Chỉnh sửa hồ sơ shop',    to: '/shop-profile',    color: 'border-orange-200 hover:border-orange-400'},
        ].map(item => (
          <Link key={item.to} to={item.to}
            className={`bg-white rounded-xl border-2 p-5 transition ${item.color}`}>
            <h3 className="font-bold text-base mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Nút đăng sản phẩm mới */}
      <div className="mt-6">
        <Link to="/products/create"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition">
          + Đăng bán sản phẩm mới
        </Link>
      </div>
    </div>
  )
}