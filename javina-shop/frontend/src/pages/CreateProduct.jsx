import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function CreateProduct() {
  const navigate       = useNavigate()
  const { isLoggedIn } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [form, setForm] = useState({
    name:           '',
    description:    '',
    category_id:    '',
    base_price:     '',
    discount_pct:   0,
    stock_qty:      1,
    condition_type: 'used',
    is_negotiable:  0,
  })

  // Chưa đăng nhập → redirect login
  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn])

  // Lấy danh sách danh mục
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data.categories))
      .catch(() => setCategories([]))
  }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/products', {
        ...form,
        base_price:   Number(form.base_price),
        discount_pct: Number(form.discount_pct),
        stock_qty:    Number(form.stock_qty),
        category_id:  Number(form.category_id),
      })
      alert('Đăng sản phẩm thành công!')
      navigate(`/products/${res.data.productId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng sản phẩm thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-orange-500 mb-6"
      >
        ← Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Đăng bán sản phẩm</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm *
            </label>
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange} required
              placeholder="VD: Sách Giải Tích 1 - Nguyễn Đình Trí"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục *
            </label>
            <select
              name="category_id" value={form.category_id}
              onChange={handleChange} required
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Giá & Giảm giá */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá bán (VNĐ) *
              </label>
              <input
                type="number" name="base_price" value={form.base_price}
                onChange={handleChange} required min="0"
                placeholder="50000"
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giảm giá (%)
              </label>
              <input
                type="number" name="discount_pct" value={form.discount_pct}
                onChange={handleChange} min="0" max="100"
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Số lượng & Tình trạng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng *
              </label>
              <input
                type="number" name="stock_qty" value={form.stock_qty}
                onChange={handleChange} required min="1"
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tình trạng *
              </label>
              <select
                name="condition_type" value={form.condition_type}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="new">Mới</option>
                <option value="like_new">Như mới</option>
                <option value="used">Đã qua sử dụng</option>
                <option value="for_rent">Cho thuê</option>
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả sản phẩm
            </label>
            <textarea
              name="description" value={form.description}
              onChange={handleChange} rows={4}
              placeholder="Mô tả chi tiết tình trạng, xuất xứ, lý do bán..."
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          {/* Thương lượng */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox" name="is_negotiable"
              checked={form.is_negotiable === 1}
              onChange={handleChange}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm text-gray-700">Cho phép thương lượng giá</span>
          </label>

          {/* Giá preview */}
          {form.base_price > 0 && (
            <div className="bg-orange-50 rounded-xl p-4 text-sm">
              <p className="text-gray-600">Giá gốc:
                <span className="font-medium ml-1">
                  {Number(form.base_price).toLocaleString('vi-VN')}đ
                </span>
              </p>
              {form.discount_pct > 0 && (
                <p className="text-orange-600 font-bold mt-1">Giá sau giảm:
                  <span className="ml-1">
                    {Math.round(form.base_price * (100 - form.discount_pct) / 100)
                      .toLocaleString('vi-VN')}đ
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Đang đăng...' : 'Đăng bán ngay'}
          </button>

        </form>
      </div>
    </div>
  )
}