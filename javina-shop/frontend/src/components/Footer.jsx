import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #FFB7C5 0%, #E8C4D8 100%)',
      marginTop: 60, padding: '40px 20px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32, marginBottom: 32 }}>

          <div>
            <div style={{ fontFamily: "'Zen Maru Gothic'", fontSize: 22, color: '#fff', marginBottom: 8 }}>
              🌸 Javina Shop
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.7 }}>
              Sàn thương mại điện tử dành riêng cho sinh viên.<br/>
              Mua bán — Trao đổi — Kết nối cộng đồng.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Khám phá</h4>
            {['Sản phẩm mới', 'Đăng bán', 'Giỏ hàng', 'Đơn hàng của tôi'].map(l => (
              <div key={l} style={{ marginBottom: 8 }}>
                <Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 13 }}>
                  {l}
                </Link>
              </div>
            ))}
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Hỗ trợ</h4>
            {['Hướng dẫn mua hàng', 'Chính sách đổi trả', 'Liên hệ', 'FAQ'].map(l => (
              <div key={l} style={{ marginBottom: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, cursor: 'pointer' }}>{l}</span>
              </div>
            ))}
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Kết nối</h4>
            <div style={{ display: 'flex', gap: 12 }}>
              {['📘','📸','🐦','▶️'].map((icon, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, cursor: 'pointer',
                }}>{icon}</div>
              ))}
            </div>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.3)',
          paddingTop: 20, textAlign: 'center',
          color: 'rgba(255,255,255,0.7)', fontSize: 12,
        }}>
          © 2025 Javina Shop • Made with 🌸 for students
        </div>
      </div>
    </footer>
  )
}