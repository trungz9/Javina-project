import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Javina from "../assets/Javina-icon.png";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth()
  const navigate  = useNavigate()
  const [keyword, setKeyword] = useState('')

  const handleSearch = e => {
    e.preventDefault()
    if (keyword.trim()) navigate(`/?search=${encodeURIComponent(keyword.trim())}`)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Row 1 */}
        <div className="flex gap-16" style={{ alignItems: 'center' }}>
          <Link to="/" className="navbar-logo">
            <img src={Javina} alt="logo" className="logo-img" />
            <div>
              <div className="navbar-logo-title">Javina Shop</div>
              <div className="navbar-logo-sub">ジャビナショップ</div>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="navbar-search-form">
            <input
              type="text" value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="🔍  Tìm kiếm sản phẩm..."
              className="navbar-search-input"
            />
            <button type="submit" className="navbar-search-btn">Tìm</button>
          </form>

          <div className="navbar-actions">
            {isLoggedIn ? (
              <>
                <Link to="/cart"         className="navbar-icon-btn"><span className="icon">🛒</span>Giỏ hàng</Link>
                <Link to="/my-orders"    className="navbar-icon-btn"><span className="icon">📦</span>Đơn hàng</Link>
                <Link to="/dashboard"    className="navbar-icon-btn"><span className="icon">🏪</span>Shop</Link>
                <button onClick={() => { logout(); navigate('/login') }} className="navbar-logout">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="navbar-link">Đăng nhập</Link>
                <Link to="/register" className="navbar-register">Đăng ký</Link>
              </>
            )}
          </div>
        </div>

        {/* Row 2: Categories */}
        <div className="navbar-categories">
          {[
            { label: '📚 Sách',      q: 'sach'      },
            { label: '💻 Điện tử',   q: 'dien tu'   },
            { label: '👗 Thời trang', q: 'thoi trang'},
            { label: '🍱 Đồ ăn',     q: 'do an'     },
            { label: '✏️ Học tập',   q: 'hoc tap'   },
            { label: '🛵 Xe cộ',     q: 'xe co'     },
          ].map(c => (
            <button key={c.q} className="navbar-cat-btn"
              onClick={() => navigate(`/?search=${c.q}`)}>
              {c.label}
            </button>
          ))}
        </div>
      <Link to="/currency" className="navbar-icon-btn">
        <span className="icon">💱</span>Tỷ giá
      </Link>
      </div>
    </nav>
  )
}