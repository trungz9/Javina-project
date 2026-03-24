import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data.products))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center mt-10">Đang tải...</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sản phẩm mới nhất</h1>

      {products.length === 0
        ? <p className="text-gray-500">Chưa có sản phẩm nào.</p>
        : (
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
                  <p className="text-xs text-gray-400 mt-1">{p.shop_name}</p>
                </div>
              </Link>
            ))}
          </div>
        )
      }
    </div>
  )
}