import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

export default function Home() {
  const [searchParams]          = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const keyword = searchParams.get('search') || ''

  useEffect(() => {
    setLoading(true)
    const url = keyword ? `/products?search=${keyword}` : '/products'
    api.get(url)
      .then(res => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [keyword])

  if (loading) return <p className="text-center mt-20">Đang tải...</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {keyword ? `Kết quả tìm kiếm: "${keyword}"` : 'Sản phẩm mới nhất'}
      </h1>
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-20">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => (
            <Link key={p.id} to={`/products/${p.id}`}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
              <img
                src={p.cover_image || 'https://placehold.co/300x200?text=No+Image'}
                alt={p.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <p className="font-medium text-sm line-clamp-2">{p.name}</p>
                <p className="text-orange-500 font-bold mt-1">
                  {Number(p.final_price).toLocaleString('vi-VN')}đ
                </p>
                {p.discount_pct > 0 && (
                  <span className="text-xs bg-red-100 text-red-500 px-1.5 py-0.5 rounded">
                    -{p.discount_pct}%
                  </span>
                )}
                <p className="text-xs text-gray-400 mt-1">{p.shop_name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}