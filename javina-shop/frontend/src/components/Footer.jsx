import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">

          <div>
            <div className="footer-logo">🌸 Javina Shop</div>
            <p className="footer-desc">
              Sàn thương mại điện tử cho người sinh sống tại Việt Nam - Nhật Bản.<br/>
              Mua bán — Trao đổi — Kết nối cộng đồng.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Khám phá</h4>
            {['Sản phẩm mới', 'Đăng bán', 'Giỏ hàng', 'Đơn hàng của tôi'].map(l => (
              <Link key={l} to="/" className="footer-link">{l}</Link>
            ))}
          </div>

          <div>
            <h4 className="footer-heading">Hỗ trợ</h4>
            {['Hướng dẫn mua hàng', 'Chính sách đổi trả', 'Liên hệ', 'FAQ'].map(l => (
              <span key={l} className="footer-link">{l}</span>
            ))}
          </div>

          <div>
            <h4 className="footer-heading">Kết nối</h4>
            <div className="flex gap-12">
              {['📘','📸','🐦','▶️'].map((icon, i) => (
                <button key={i} className="footer-social-btn">{icon}</button>
              ))}
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          © 2025 Javina Shop • Made with 🌸 for students
        </div>
      </div>
    </footer>
  )
}