import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function RecommendedProducts() {
  const { isLoggedIn } = useAuth()
  const [products, setProducts] = useState([])
  const [method, setMethod]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) return
    api.get('/products/recommendations')
      .then(res => {
        setProducts(res.data.products)
        setMethod(res.data.method)
      })
      .catch(() => {})
  }, [isLoggedIn])

  if (!isLoggedIn || products.length === 0) return null

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>
        {method === 'collaborative'
          ? '✨ Gợi ý dành cho bạn'
          : '🔥 Sản phẩm phổ biến'}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 16
      }}>
        {products.map(p => (
          <div key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            style={{
              cursor: 'pointer', borderRadius: 8,
              border: '1px solid var(--color-border-tertiary)',
              overflow: 'hidden'
            }}
          >
            <img
              src={p.cover_image || '/placeholder.jpg'}
              alt={p.name}
              style={{ width: '100%', height: 140, objectFit: 'cover' }}
            />
            <div style={{ padding: '8px 12px' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500,
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap' }}>
                {p.name}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 12,
                          color: 'var(--color-text-secondary)' }}>
                {(p.final_price || p.base_price).toLocaleString('vi-VN')}đ
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}