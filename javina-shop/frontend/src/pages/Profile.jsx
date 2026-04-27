// frontend/src/pages/Profile.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function ViewHistory() {
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/interactions/history')
      .then(res => setHistory(res.data.history))
      .catch(() => {})
  }, [])

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>
        🕐 Đã xem gần đây
      </h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {history.map(p => (
          <div key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            style={{ cursor: 'pointer', width: 120 }}
          >
            <img src={p.cover_image || '/placeholder.jpg'}
              style={{ width: 120, height: 100, objectFit: 'cover', borderRadius: 8 }}
            />
            <p style={{ fontSize: 12, margin: '4px 0 0',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap' }}>
              {p.name}
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: 0 }}>
              Đã xem {p.view_count} lần
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}