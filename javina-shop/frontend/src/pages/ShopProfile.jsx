import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function ShopProfile() {
  const [form, setForm]     = useState({ shop_name: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState('')

  useEffect(() => {
    api.get('/shop')
      .then(res => setForm({
        shop_name:   res.data.shop.shop_name   || '',
        description: res.data.shop.description || '',
      }))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/shop', form)
      setMsg('Cập nhật thành công!')
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setMsg(err.response?.data?.message || 'Lỗi!')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-center mt-20">Đang tải...</p>

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thông tin shop</h1>

      {msg && (
        <p className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm mb-4">
          {msg}
        </p>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên shop
          </label>
          <input
            type="text" value={form.shop_name}
            onChange={e => setForm({ ...form, shop_name: e.target.value })}
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả shop
          </label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Giới thiệu về shop của bạn..."
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>
        <button
          type="submit" disabled={saving}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  )
}