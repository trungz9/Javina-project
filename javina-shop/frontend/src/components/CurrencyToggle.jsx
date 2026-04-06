import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function CurrencyToggle({ priceVnd }) {
  const [currency, setCurrency] = useState('VND')
  const [rate,     setRate]     = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get('/currency/current')
      .then(res => setRate(res.data.rate))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <span style={{ fontSize: 13, color: '#bbb' }}>Đang tải tỷ giá...</span>
  )

  const priceJpy = rate
    ? Math.round(priceVnd * parseFloat(rate.vnd_to_jpy))
    : null

  const displayPrice = currency === 'VND'
    ? `${Number(priceVnd).toLocaleString('vi-VN')} ₫`
    : `¥ ${Number(priceJpy).toLocaleString('ja-JP')}`

  const toggle = () => setCurrency(c => c === 'VND' ? 'JPY' : 'VND')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Giá hiển thị */}
      <span style={{
        fontSize: 28, fontWeight: 700,
        color: 'var(--sakura-dark)',
        transition: 'all 0.3s',
      }}>
        {displayPrice}
      </span>

      {/* Nút đổi tiền tệ */}
      <button onClick={toggle} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: currency === 'VND'
          ? 'linear-gradient(135deg, #E8402A, #FF6B4A)'
          : 'linear-gradient(135deg, #E8849A, #FFB7C5)',
        border: 'none', borderRadius: 20,
        padding: '6px 14px', cursor: 'pointer',
        color: '#fff', fontSize: 13, fontWeight: 700,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'all 0.3s',
      }}>
        <span style={{ fontSize: 16 }}>
          {currency === 'VND' ? '🇻🇳' : '🇯🇵'}
        </span>
        <span>{currency}</span>
        <span style={{ opacity: 0.7 }}>⇄</span>
        <span>{currency === 'VND' ? 'JPY' : 'VND'}</span>
      </button>

      {/* Tỷ giá nhỏ bên dưới */}
      {rate && (
        <span style={{ fontSize: 11, color: '#bbb' }}>
          1 JPY = {Number(rate.jpy_to_vnd).toLocaleString('vi-VN')}đ
        </span>
      )}
    </div>
  )
}