import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  const handleSearch = e => {
    e.preventDefault()
    if (keyword.trim()) navigate(`/?search=${encodeURIComponent(keyword.trim())}`)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="bg-orange-500 text-white px-4 py-3 sticky top-0 z-50 shadow">
      <div className="max-w-6xl mx-auto flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="font-bold text-xl whitespace-nowrap">
          Javina Shop
        </Link>

        {/* Thanh tìm kiếm */}
        <form onSubmit={handleSearch} className="flex-1 flex">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full px-4 py-1.5 rounded-l-xl text-gray-800 text-sm focus:outline-none"
          />
          <button type="submit"
            className="bg-orange-700 hover:bg-orange-800 px-4 rounded-r-xl text-sm font-medium">
            Tìm
          </button>
        </form>

        {/* Menu */}
        <div className="flex items-center gap-3 text-sm whitespace-nowrap">
          {isLoggedIn ? (
            <>
              <Link to="/products/create" className="hover:underline">Đăng bán</Link>
              <Link to="/cart"            className="hover:underline">Giỏ hàng</Link>
              <Link to="/my-orders"       className="hover:underline">Đơn hàng</Link>
              <Link to="/dashboard"       className="hover:underline">Shop</Link>
              <button onClick={handleLogout}
                className="bg-white text-orange-500 px-3 py-1 rounded-lg text-xs font-semibold">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="hover:underline">Đăng nhập</Link>
              <Link to="/register"
                className="bg-white text-orange-500 px-3 py-1 rounded-lg font-semibold text-xs">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}