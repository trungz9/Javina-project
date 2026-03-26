import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-orange-500 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold tracking-tight">
        Ichiba VN
      </Link>

      {/* Search */}
      <div className="hidden md:flex flex-1 mx-8">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full px-4 py-1.5 rounded-l-xl text-gray-800 text-sm focus:outline-none"
        />
        <button className="bg-orange-700 hover:bg-orange-800 px-4 rounded-r-xl text-sm">
          Tìm
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 text-sm">
        <Link to="/cart" className="flex items-center gap-1 hover:text-orange-200">
          Giỏ hàng
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Link to="/dashboard"
              className="bg-white text-orange-500 px-3 py-1 rounded-lg font-medium hover:bg-orange-50">
              Shop của tôi
            </Link>
            <div className="flex items-center gap-2">
              <span className="hidden md:block">{user?.full_name}</span>
              <button
                onClick={handleLogout}
                className="bg-orange-700 hover:bg-orange-800 px-3 py-1 rounded-lg"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login"
              className="bg-white text-orange-500 px-3 py-1 rounded-lg font-medium">
              Đăng nhập
            </Link>
            <Link to="/register"
              className="bg-orange-700 hover:bg-orange-800 px-3 py-1 rounded-lg">
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}