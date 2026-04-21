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

  // ✅ THÊM: state lưu ảnh
  const [images, setImages]         = useState([])      // File objects
  const [previews, setPreviews]     = useState([])      // URL preview

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

  // ✅ THÊM: xử lý chọn ảnh
  const handleImageChange = e => {
    const files = Array.from(e.target.files)

    // Giới hạn tối đa 5 ảnh
    if (files.length + images.length > 5) {
      setError('Chỉ được upload tối đa 5 ảnh!')
      return
    }

    // Kiểm tra định dạng
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    const invalid = files.filter(f => !allowed.includes(f.type))
    if (invalid.length > 0) {
      setError('Chỉ chấp nhận ảnh JPG, PNG, WEBP!')
      return
    }

    setError('')
    setImages(prev => [...prev, ...files])

    // Tạo URL preview
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  // ✅ THÊM: xóa ảnh đã chọn
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]) // giải phóng bộ nhớ
      return prev.filter((_, i) => i !== index)
    })
  }

  // ✅ SỬA: dùng FormData thay vì JSON
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')

    try {
      const formData = new FormData()

      // Append các field text
      formData.append('name',           form.name)
      formData.append('description',    form.description)
      formData.append('category_id',    Number(form.category_id))
      formData.append('base_price',     Number(form.base_price))
      formData.append('discount_pct',   Number(form.discount_pct))
      formData.append('stock_qty',      Number(form.stock_qty))
      formData.append('condition_type', form.condition_type)
      formData.append('is_negotiable',  form.is_negotiable)

      // ✅ Append từng file ảnh
      images.forEach(img => {
        formData.append('images', img) // key phải là 'images'
      })

      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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

          {/* ✅ THÊM: Upload ảnh */}
          <div className="form-group">
            <label className="form-label">Ảnh sản phẩm (tối đa 5 ảnh)</label>

            {/* Nút chọn ảnh */}
            <label className="upload-box" style={{ cursor: 'pointer' }}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
                disabled={images.length >= 5}
              />
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>📷 Nhấn để chọn ảnh</p>
                <p className="text-sm text-gray">JPG, PNG, WEBP • Tối đa 5 ảnh</p>
              </div>
            </label>

            {/* ✅ Preview ảnh đã chọn */}
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      style={{ width: 80, height: 80, objectFit: 'cover',
                               borderRadius: 8, border: '2px solid var(--sakura-dark)' }}
                    />
                    {/* Nút xóa ảnh */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        background: 'red', color: 'white',
                        border: 'none', borderRadius: '50%',
                        width: 20, height: 20, cursor: 'pointer',
                        fontSize: 12, lineHeight: '20px', textAlign: 'center'
                      }}
                    >✕</button>
                    {/* Badge ảnh đại diện */}
                    {i === 0 && (
                      <span style={{
                        position: 'absolute', bottom: 2, left: 2,
                        background: 'var(--sakura-dark)', color: 'white',
                        fontSize: 9, padding: '1px 4px', borderRadius: 4
                      }}>Bìa</span>
                    )}
                  </div>
                ))}
              </div>
            )}
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