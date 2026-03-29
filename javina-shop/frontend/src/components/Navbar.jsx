import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate  = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = e => {
    e.preventDefault()
    if (keyword.trim()) navigate(`/?search=${encodeURIComponent(keyword.trim())}`)
  }

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #FFB7C5 0%, #FFD4DF 50%, #E8C4D8 100%)',
      boxShadow: '0 2px 20px rgba(255,183,197,0.3)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 20px' }}>

        {/* Row 1: Logo + Search + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24 }}>🌸</span>
              <div>
                <div style={{
                  fontFamily: "'Zen Maru Gothic', sans-serif",
                  fontWeight: 700, fontSize: 18,
                  color: '#fff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  lineHeight: 1.1
                }}>Javina Shop</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }}>
                  ジャビナショップ
                </div>
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex' }}>
            <input
              type="text" value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="🔍  Tìm kiếm sản phẩm..."
              style={{
                width: '100%', border: 'none', outline: 'none',
                padding: '10px 16px', borderRadius: '12px 0 0 12px',
                fontSize: 14, background: 'rgba(255,255,255,0.95)',
                color: '#2D2D2D',
              }}
            />
            <button type="submit" style={{
              background: '#E8849A', border: 'none', cursor: 'pointer',
              padding: '10px 20px', borderRadius: '0 12px 12px 0',
              color: '#fff', fontWeight: 700, fontSize: 14,
            }}>Tìm</button>
          </form>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {isLoggedIn ? (
              <>
                <NavBtn to="/cart" icon="🛒" label="Giỏ hàng" />
                <NavBtn to="/my-orders" icon="📦" label="Đơn hàng" />
                <NavBtn to="/dashboard" icon="🏪" label="Shop" />
                <button onClick={() => { logout(); navigate('/login') }} style={{
                  background: 'rgba(255,255,255,0.3)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  borderRadius: 10, padding: '6px 14px',
                  color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}>Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500
                }}>Đăng nhập</Link>
                <Link to="/register" style={{
                  background: '#fff', color: '#E8849A',
                  padding: '7px 16px', borderRadius: 10,
                  textDecoration: 'none', fontWeight: 700, fontSize: 13,
                }}>Đăng ký</Link>
              </>
            )}
          </div>
        </div>

        {/* Row 2: Category links */}
        <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
          {[
            { label: '📚 Sách', q: 'sach' },
            { label: '💻 Điện tử', q: 'dien-tu' },
            { label: '👗 Thời trang', q: 'thoi-trang' },
            { label: '🍱 Đồ ăn', q: 'do-an' },
            { label: '✏️ Học tập', q: 'hoc-tap' },
            { label: '🛵 Xe cộ', q: 'xe-co' },
          ].map(cat => (
            <button key={cat.q}
              onClick={() => navigate(`/?search=${cat.q}`)}
              style={{
                background: 'rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 20, padding: '3px 12px',
                color: '#fff', cursor: 'pointer', fontSize: 12,
                fontWeight: 500, backdropFilter: 'blur(4px)',
              }}>
              {cat.label}
            </button>
          ))}
        </div>

      </div>
    </nav>
  )
}

function NavBtn({ to, icon, label }) {
  return (
    <Link to={to} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textDecoration: 'none', color: '#fff', fontSize: 11,
      background: 'rgba(255,255,255,0.2)', borderRadius: 10,
      padding: '5px 10px', minWidth: 52,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ marginTop: 1 }}>{label}</span>
    </Link>
  )
}