import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function ManageProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetchProducts = () => {
    api.get('/shop/products')
      .then(res => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Ẩn sản phẩm "${name}"?`)) return
    try {
      await api.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Xoá thất bại!')
    }
  }

  if (loading) return <p className="text-center mt-20">Đang tải...</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm ({products.length})</h1>
        <Link to="/products/create"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
          + Đăng sản phẩm mới
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-400 text-center py-20">Chưa có sản phẩm nào!</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Sản phẩm</th>
                <th className="text-left px-4 py-3">Danh mục</th>
                <th className="text-right px-4 py-3">Giá</th>
                <th className="text-right px-4 py-3">Tồn kho</th>
                <th className="text-right px-4 py-3">Đã bán</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-center px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.cover_image || 'https://placehold.co/50x50?text=SP'}
                        className="w-10 h-10 rounded-lg object-cover"
                        alt={p.name}
                      />
                      <span className="font-medium line-clamp-1 max-w-xs">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.category_name}</td>
                  <td className="px-4 py-3 text-right text-orange-500 font-medium">
                    {Number(p.final_price).toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-4 py-3 text-right">{p.stock_qty}</td>
                  <td className="px-4 py-3 text-right">{p.sold_qty}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${p.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Đang bán' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => navigate(`/products/${p.id}`)}
                        className="text-blue-500 hover:underline text-xs">
                        Xem
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="text-red-400 hover:underline text-xs">
                        Ẩn
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}