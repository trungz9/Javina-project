import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

const BANNERS = [
  { bg: 'linear-gradient(135deg,#FFB7C5,#FFD4DF)', emoji: '🌸', title: 'Hàng Nhật chính hãng', sub: 'Giá sinh viên — Chất lượng Nhật Bản' },
  { bg: 'linear-gradient(135deg,#B5C9A1,#D4E8C8)', emoji: '🍵', title: 'Sách & Tài liệu học tập', sub: 'Trao đổi — Mua bán trong cộng đồng SV' },
  { bg: 'linear-gradient(135deg,#A8C8E8,#C8DFF5)', emoji: '💙', title: 'Miễn phí ship nội khu', sub: 'Giao hàng trong trường chỉ 0đ' },
]

export default function Home() {
  const [searchParams]          = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [banner, setBanner]     = useState(0)
  const keyword = searchParams.get('search') || ''

  useEffect(() => {
    const t = setInterval(() => setBanner(b => (b + 1) % BANNERS.length), 3500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setLoading(true)
    api.get(keyword ? `/products?search=${keyword}` : '/products')
      .then(res => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [keyword])

  const b = BANNERS[banner]

  return (
    <div style={{ background: 'var(--shiro)', minHeight: '100vh' }}>

      {/* Hero Banner */}
      {!keyword && (
        <div style={{
          background: b.bg,
          padding: '48px 20px',
          textAlign: 'center',
          transition: 'background 0.8s ease',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: [80,50,120,60,90][i],
              height: [80,50,120,60,90][i],
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              top: ['10%','60%','5%','70%','30%'][i],
              left: ['5%','80%','60%','15%','45%'][i],
            }}/>
          ))}
          <div style={{ fontSize: 56, marginBottom: 12 }}>{b.emoji}</div>
          <h1 style={{
            fontFamily: "'Zen Maru Gothic'",
            fontSize: 32, color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: 8,
          }}>{b.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 24 }}>
            {b.sub}
          </p>
          <Link to="/products/create" style={{
            background: '#fff', color: '#E8849A',
            padding: '12px 32px', borderRadius: 24,
            textDecoration: 'none', fontWeight: 700, fontSize: 15,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            🌸 Đăng bán ngay
          </Link>

          {/* Banner dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            {BANNERS.map((_, i) => (
              <div key={i} onClick={() => setBanner(i)} style={{
                width: i === banner ? 24 : 8, height: 8,
                borderRadius: 4, background: 'rgba(255,255,255,0.8)',
                cursor: 'pointer', transition: 'width 0.3s',
              }}/>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills */}
      {!keyword && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 0' }}>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {[
              { emoji: '📚', label: 'Sách', q: 'sach' },
              { emoji: '💻', label: 'Điện tử', q: 'dien tu' },
              { emoji: '👗', label: 'Thời trang', q: 'thoi trang' },
              { emoji: '🍱', label: 'Đồ ăn', q: 'do an' },
              { emoji: '✏️', label: 'Học tập', q: 'hoc tap' },
              { emoji: '🛵', label: 'Xe cộ', q: 'xe co' },
              { emoji: '🏠', label: 'Nội thất', q: 'noi that' },
            ].map(c => (
              <Link key={c.q} to={`/?search=${c.q}`} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 6, textDecoration: 'none', flexShrink: 0,
                background: '#fff', borderRadius: 16,
                padding: '12px 18px',
                boxShadow: 'var(--shadow-card)',
                color: 'var(--kuro)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: 28 }}>{c.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Zen Maru Gothic'" }}>
            {keyword ? `🔍 Kết quả: "${keyword}"` : '✨ Sản phẩm mới nhất'}
          </h2>
          {!keyword && (
            <span style={{ fontSize: 13, color: 'var(--gray)' }}>{products.length} sản phẩm</span>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                background: '#f0f0f0', borderRadius: 16, height: 260,
                animation: 'pulse 1.5s infinite',
              }}/>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🌸</div>
            <p style={{ color: 'var(--gray)', fontSize: 16 }}>Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {products.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>

    </div>
  )
}

function ProductCard({ p }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link to={`/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: hovered ? '0 8px 32px rgba(255,183,197,0.25)' : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.25s ease',
        border: '1.5px solid',
        borderColor: hovered ? 'var(--sakura)' : 'transparent',
      }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={p.cover_image || 'https://placehold.co/300x220?text=🌸'}
            alt={p.name}
            style={{ width: '100%', height: 180, objectFit: 'cover' }}
          />
          {p.discount_pct > 0 && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: '#E8849A', color: '#fff',
              fontSize: 11, fontWeight: 700,
              padding: '3px 8px', borderRadius: 20,
            }}>
              -{p.discount_pct}%
            </div>
          )}
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(255,255,255,0.9)',
            fontSize: 10, padding: '2px 8px',
            borderRadius: 20, color: '#888',
          }}>
            {{ new:'Mới', like_new:'Như mới', used:'Đã dùng', for_rent:'Cho thuê' }[p.condition_type]}
          </div>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            marginBottom: 8, minHeight: 36,
          }}>{p.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ color: '#E8849A', fontWeight: 700, fontSize: 16 }}>
              {Number(p.final_price).toLocaleString('vi-VN')}đ
            </span>
            {p.discount_pct > 0 && (
              <span style={{ color: '#bbb', fontSize: 11, textDecoration: 'line-through' }}>
                {Number(p.base_price).toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#aaa' }}>🏪 {p.shop_name}</span>
            <span style={{ fontSize: 11, color: '#aaa' }}>Đã bán {p.sold_qty}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}