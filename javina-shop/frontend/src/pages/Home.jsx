import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

const BANNERS = [
  { bg: 'linear-gradient(135deg,#FFB7C5,#FFD4DF)', emoji: '🌸', title: 'Hàng Nhật chính hãng',       sub: 'Giá sinh viên — Chất lượng Nhật Bản'        },
  { bg: 'linear-gradient(135deg,#B5C9A1,#D4E8C8)', emoji: '🍵', title: 'Sách & Tài liệu học tập',    sub: 'Trao đổi — Mua bán trong cộng đồng SV'      },
  { bg: 'linear-gradient(135deg,#A8C8E8,#C8DFF5)', emoji: '💙', title: 'Miễn phí ship nội khu',       sub: 'Giao hàng trong trường chỉ 0đ'              },
]

const CATEGORIES = [
  { emoji:'📚', label:'Sách',      q:'sach'      },
  { emoji:'💻', label:'Điện tử',   q:'dien tu'   },
  { emoji:'👗', label:'Thời trang',q:'thoi trang'},
  { emoji:'🍱', label:'Đồ ăn',     q:'do an'     },
  { emoji:'✏️', label:'Học tập',   q:'hoc tap'   },
  { emoji:'🛵', label:'Xe cộ',     q:'xe co'     },
  { emoji:'🏠', label:'Nội thất',  q:'noi that'  },
]

const CONDITION_LABEL = {
  new:'Mới', like_new:'Như mới', used:'Đã dùng', for_rent:'Cho thuê'
}

export default function Home() {
  const [searchParams]          = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [banner, setBanner]     = useState(0)
  const [currency, setCurrency] = useState('VND') 
  const [rate, setRate]         = useState(null)
  const keyword = searchParams.get('search') || ''

  useEffect(() => {
    api.get('/currency/current')
      .then(res => setRate(res.data.rate))
      .catch(() => {})
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
    <div>
      {/* Hero Banner */}
      {!keyword && (
        <div className="hero" style={{ background: b.bg }}>
          {[80,50,120,60,90].map((size, i) => (
            <div key={i} className="hero-deco" style={{
              width: size, height: size,
              top:  ['10%','60%','5%','70%','30%'][i],
              left: ['5%','80%','60%','15%','45%'][i],
            }}/>
          ))}
          <div className="hero-emoji">{b.emoji}</div>
          <h1 className="hero-title">{b.title}</h1>
          <p className="hero-sub">{b.sub}</p>
          <Link to="/products/create" className="hero-cta">🌸 Đăng bán ngay</Link>
          <div className="hero-dots">
            {BANNERS.map((_, i) => (
              <div key={i} onClick={() => setBanner(i)}
                className={`hero-dot ${i === banner ? 'hero-dot-active' : 'hero-dot-inactive'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {!keyword && (
        <div className="container mt-24">
          <div className="category-strip">
            {CATEGORIES.map(c => (
              <Link key={c.q} to={`/?search=${c.q}`} className="category-pill">
                <span className="category-pill-icon">{c.emoji}</span>
                <span className="category-pill-label">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="container page">
        <div className="flex-between mb-16">
          <h2 className="font-jp text-lg font-bold">
            {keyword ? `🔍 Kết quả: "${keyword}"` : '✨ Sản phẩm mới nhất'}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {rate && (
              <span style={{ fontSize: 12, color: '#aaa' }}>
                ¥1 = {Number(rate.jpy_to_vnd).toLocaleString('vi-VN')}đ
              </span>
            )}
            <div style={{
              display: 'flex', borderRadius: 20, overflow: 'hidden',
              border: '1.5px solid var(--sakura-light)',
            }}>
              <button onClick={() => setCurrency('VND')} style={{
                padding: '6px 16px', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                background: currency === 'VND' ? 'var(--sakura-dark)' : '#fff',
                color:      currency === 'VND' ? '#fff' : '#888',
              }}>
                🇻🇳 VNĐ
              </button>
              <button onClick={() => setCurrency('JPY')} style={{
                padding: '6px 16px', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                background: currency === 'JPY' ? '#E8402A' : '#fff',
                color:      currency === 'JPY' ? '#fff' : '#888',
              }}>
                🇯🇵 JPY
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid-products">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 260 }}/>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌸</div>
            <p className="empty-state-text">Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <div className="grid-products">
            {products.map(p => (
              <ProductCard key={p.id} p={p} currency={currency} rate={rate} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ p, currency, rate }) {
  const priceVnd = Number(p.final_price)
  const priceJpy = rate
    ? Math.round(priceVnd * parseFloat(rate.vnd_to_jpy))
    : null

  const displayPrice = currency === 'JPY' && priceJpy
    ? `¥${priceJpy.toLocaleString('ja-JP')}`
    : `${priceVnd.toLocaleString('vi-VN')}đ`

  return (
    <Link to={`/products/${p.id}`} className="product-card">
      <div className="product-card-img-wrap">
        <img
          src={p.cover_image || 'https://placehold.co/300x220?text=🌸'}
          alt={p.name} className="product-card-img"
        />
        {p.discount_pct > 0 && (
          <div className="product-card-discount">-{p.discount_pct}%</div>
        )}
        <div className="product-card-condition">
          {CONDITION_LABEL[p.condition_type]}
        </div>
      </div>
      <div className="product-card-body">
        <p className="product-card-name">{p.name}</p>
        <div className="flex" style={{ alignItems: 'center' }}>
          {/* 👈 Giá thay đổi theo nút VND/JPY */}
          <span className="product-card-price">{displayPrice}</span>
          {p.discount_pct > 0 && (
            <span className="product-card-old-price">
              {currency === 'JPY' && rate
                ? `¥${Math.round(Number(p.base_price) * parseFloat(rate.vnd_to_jpy)).toLocaleString()}`
                : `${Number(p.base_price).toLocaleString('vi-VN')}đ`
              }
            </span>
          )}
        </div>
        <div className="product-card-footer">
          <span className="product-card-shop">🏪 {p.shop_name}</span>
          <span className="product-card-sold">Đã bán {p.sold_qty}</span>
        </div>
      </div>
    </Link>
  )
}