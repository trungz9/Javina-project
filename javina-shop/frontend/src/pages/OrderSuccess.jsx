import { useLocation, useNavigate } from 'react-router-dom'

export default function OrderSuccess() {
  const { state }  = useLocation()
  const navigate   = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow p-10 text-center max-w-md w-full">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-green-500 mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-500 mb-1">Mã đơn hàng:</p>
        <p className="font-bold text-lg mb-4">{state?.order_code}</p>
        <p className="text-orange-500 font-bold text-xl mb-6">
          {Number(state?.total).toLocaleString('vi-VN')}đ
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/my-orders')}
            className="flex-1 border-2 border-orange-500 text-orange-500 font-semibold py-2 rounded-xl"
          >
            Xem đơn hàng
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-orange-500 text-white font-semibold py-2 rounded-xl"
          >
            Tiếp tục mua
          </button>
        </div>
      </div>
    </div>
  )
}