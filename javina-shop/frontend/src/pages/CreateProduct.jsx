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
    name:'', description:'', category_id:'',
    base_price:'', discount_pct:0,
    stock_qty:1, condition_type:'used', is_negotiable:0,
  })

  useEffect(() => { if (!isLoggedIn) navigate('/login') }, [isLoggedIn])

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data.categories))
      .catch(() => {})
  }, [])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
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
    } finally { setLoading(false) }
  }

  const finalPrice = form.base_price
    ? Math.round(form.base_price * (100 - form.discount_pct) / 100)
    : 0

  return (
    <div className="create-page">
      <button onClick={() => navigate(-1)} className="detail-back">← Quay lại</button>

      <div className="create-card">
        <h1 className="create-title">🌸 Đăng bán sản phẩm</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Tên */}
          <div className="form-group">
            <label className="form-label">Tên sản phẩm *</label>
            <input name="name" value={form.name} onChange={handleChange}
              required placeholder="VD: Sách Giải Tích 1"
              className="form-input"/>
          </div>

          {/* Danh mục */}
          <div className="form-group">
            <label className="form-label">Danh mục *</label>
            <select name="category_id" value={form.category_id}
              onChange={handleChange} required className="form-select">
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Giá */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Giá bán (VNĐ) *</label>
              <input name="base_price" type="number" min="0"
                value={form.base_price} onChange={handleChange}
                required placeholder="50000" className="form-input"/>
            </div>
            <div className="form-group">
              <label className="form-label">Giảm giá (%)</label>
              <input name="discount_pct" type="number" min="0" max="100"
                value={form.discount_pct} onChange={handleChange}
                className="form-input"/>
            </div>
          </div>

          {/* Số lượng & Tình trạng */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Số lượng *</label>
              <input name="stock_qty" type="number" min="1"
                value={form.stock_qty} onChange={handleChange}
                required className="form-input"/>
            </div>
            <div className="form-group">
              <label className="form-label">Tình trạng *</label>
              <select name="condition_type" value={form.condition_type}
                onChange={handleChange} className="form-select">
                <option value="new">Mới</option>
                <option value="like_new">Như mới</option>
                <option value="used">Đã qua sử dụng</option>
                <option value="for_rent">Cho thuê</option>
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <div className="form-group">
            <label className="form-label">Mô tả sản phẩm</label>
            <textarea name="description" value={form.description}
              onChange={handleChange} rows={4}
              placeholder="Mô tả chi tiết tình trạng, xuất xứ, lý do bán..."
              className="form-textarea"/>
          </div>

          {/* Thương lượng */}
          <label className="flex gap-8 mb-16" style={{ alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" name="is_negotiable"
              checked={form.is_negotiable === 1}
              onChange={handleChange}
              style={{ width: 16, height: 16, accentColor: 'var(--sakura-dark)' }}
            />
            <span className="text-sm">Cho phép thương lượng giá</span>
          </label>

          {/* Preview giá */}
          {form.base_price > 0 && (
            <div className="price-preview mb-16">
              <p className="text-sm text-gray">
                Giá gốc: <strong>{Number(form.base_price).toLocaleString('vi-VN')}đ</strong>
              </p>
              {form.discount_pct > 0 && (
                <p className="price-preview-final">
                  Giá sau giảm: {finalPrice.toLocaleString('vi-VN')}đ
                </p>
              )}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn btn-primary btn-full btn-lg">
            {loading ? 'Đang đăng...' : '🌸 Đăng bán ngay'}
          </button>
        </form>
      </div>
    </div>
  )
}