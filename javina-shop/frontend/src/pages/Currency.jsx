import CurrencyChart from '../components/CurrencyChart'

export default function Currency() {
  return (
    <div className="page-wide">
      <div className="mb-24">
        <h1 className="font-jp text-2xl font-bold">
          💱 Tỷ giá VND ⇄ JPY
        </h1>
        <p className="text-gray text-sm mt-8">
          Dữ liệu cập nhật mỗi 1 phút • Lưu trữ 7 ngày •
          Dự đoán bằng Linear Regression
        </p>
      </div>

      <CurrencyChart />

      {/* Hướng dẫn đọc biểu đồ */}
      <div className="card">
        <h3 className="font-bold mb-12">📖 Hướng dẫn đọc biểu đồ</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { color: '#E8849A', dash: false, label: 'Đường thực tế',   desc: 'Tỷ giá JPY/VND trong 7 ngày qua' },
            { color: '#4A8A4A', dash: true,  label: 'Đường dự đoán',   desc: 'Xu hướng dự đoán 1-2 ngày tới'   },
            { color: '#FFB7C5', dash: true,  label: 'Đường mốc hiện tại', desc: 'Thời điểm hiện tại'            },
          ].map(item => (
            <div key={item.label} className="flex gap-12" style={{ alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 3, marginTop: 8, flexShrink: 0,
                background: item.color,
                borderTop: item.dash ? `3px dashed ${item.color}` : 'none',
              }}/>
              <div>
                <p style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: '#888' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#bbb', marginTop: 16 }}>
          ⚠️ Lưu ý: Dự đoán chỉ mang tính tham khảo dựa trên xu hướng tuyến tính.
          Tỷ giá thực tế có thể biến động do nhiều yếu tố kinh tế vĩ mô.
        </p>
      </div>
    </div>
  )
}