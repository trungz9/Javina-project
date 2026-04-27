import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function SearchBar() {
  const [query, setSuggestions] = useState([])
  const [input, setInput]       = useState('')
  const [show, setShow]         = useState(false)
  const navigate  = useNavigate()
  const timerRef  = useRef(null)

  useEffect(() => {
    if (input.trim().length < 1) {
      setSuggestions([])
      return
    }

    // Debounce 300ms — không gọi API mỗi ký tự
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/products/autocomplete?q=${input}`)
        setSuggestions(res.data.suggestions)
        setShow(true)
      } catch {}
    }, 300)

    return () => clearTimeout(timerRef.current)
  }, [input])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        placeholder="🔍 Tìm kiếm sản phẩm..."
        className="form-input"
      />

      {show && query.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--color-background-primary)',
          border: '1px solid var(--color-border-tertiary)',
          borderRadius: 8, zIndex: 999, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {query.map(p => (
            <div key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              style={{
                padding: '10px 16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: '1px solid var(--color-border-tertiary)'
              }}
            >
              {p.cover_image && (
                <img src={p.cover_image} alt=""
                  style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }}
                />
              )}
              <div>
                <p style={{ margin: 0, fontSize: 14 }}>{p.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  {p.base_price.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}