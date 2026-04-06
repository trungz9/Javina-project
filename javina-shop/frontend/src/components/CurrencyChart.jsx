import { useEffect, useState, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts'
import api from '../api/axios'

const TIME_FILTERS = [
  { label: '3 tiếng',  value: '3h',  hours: 3  },
  { label: '12 tiếng', value: '12h', hours: 12 },
  { label: '1 ngày',   value: '1d',  hours: 24 },
  { label: '3 ngày',   value: '3d',  hours: 72 },
  { label: '7 ngày',   value: '7d',  hours: 168},
]

export default function CurrencyChart() {
  const [history,     setHistory]     = useState([])
  const [prediction,  setPrediction]  = useState(null)
  const [currentRate, setCurrentRate] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [timeFilter,  setTimeFilter]  = useState('1d')
  const [lastUpdate,  setLastUpdate]  = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      setError('')
      const [cur, hist, pred] = await Promise.all([
        api.get('/currency/current'),
        api.get('/currency/history'),
        api.get('/currency/predict').catch(() => ({ data: null })),
      ])
      setCurrentRate(cur.data.rate)
      setHistory(hist.data.history || [])
      if (pred.data) setPrediction(pred.data)
      setLastUpdate(new Date())
    } catch (err) {
      setError('Không thể tải dữ liệu tỷ giá. Vui lòng thử lại!')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    // Tự động refresh mỗi 30 phút
    const interval = setInterval(fetchAll, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchAll])

  // Lọc dữ liệu theo bộ lọc thời gian
  const getFilteredData = () => {
    const filter = TIME_FILTERS.find(f => f.value === timeFilter)
    if (!filter || history.length === 0) return []

    const cutoff = new Date()
    cutoff.setHours(cutoff.getHours() - filter.hours)

    const filtered = history.filter(h =>
      new Date(h.time_slot) >= cutoff
    )

    // Nếu không đủ dữ liệu → dùng hết
    const data = filtered.length > 0 ? filtered : history

    return data.map(h => ({
      time:  formatTime(h.time_slot, timeFilter),
      rate:  parseFloat(h.jpy_to_vnd),
      min:   parseFloat(h.min_rate),
      max:   parseFloat(h.max_rate),
    }))
  }

  const formatTime = (timeSlot, filter) => {
    const d = new Date(timeSlot)
    if (['3h','12h'].includes(filter)) {
      return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
    }
    if (filter === '1d') {
      return `${String(d.getHours()).padStart(2,'0')}:00`
    }
    return `${d.getDate()}/${d.getMonth()+1}`
  }

  // Thêm điểm dự đoán vào cuối
  const getChartData = () => {
    const filtered = getFilteredData()
    if (!prediction?.predictions || timeFilter !== '7d') return filtered

    const predPoints = prediction.predictions.map(p => ({
      time:      p.label,
      predicted: p.predicted_jpy_to_vnd,
    }))
    return [...filtered, ...predPoints]
  }

  const chartData = getChartData()
  const trend     = prediction?.predictions?.[0]
  const trendColor = trend?.trend === 'increase' ? '#4A8A4A'
    : trend?.trend === 'decrease' ? '#E05555' : '#888'

  if (loading) return (
    <div className="card" style={{ minHeight: 400 }}>
      <div className="loading-center" style={{ minHeight: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💱</div>
          <p className="text-gray">Đang tải dữ liệu tỷ giá...</p>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="card">
      <div className="alert alert-error">{error}</div>
      <button className="btn btn-primary btn-sm" onClick={fetchAll}>
        Thử lại
      </button>
    </div>
  )

  if (history.length === 0) return (
    <div className="card">
      <div className="empty-state">
        <div className="empty-state-icon">💱</div>
        <p className="empty-state-text">
          Chưa có dữ liệu tỷ giá!<br/>
          <span className="text-xs text-gray">
            Server đang thu thập dữ liệu, vui lòng đợi 30 phút...
          </span>
        </p>
        <button className="btn btn-primary btn-sm mt-16" onClick={fetchAll}>
          Làm mới
        </button>
      </div>
    </div>
  )

  return (
    <div className="card mb-24">

      {/* Header */}
      <div className="flex-between mb-16" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="font-jp text-lg font-bold">💱 Tỷ giá JPY / VND</h2>
          <p className="text-gray text-xs mt-4">
            Nguồn: ExchangeRate-API •
            Cập nhật lúc: {lastUpdate?.toLocaleTimeString('vi-VN') || '...'}
          </p>
        </div>

        {/* Tỷ giá hiện tại */}
        {currentRate && (
          <div style={{
            background: 'var(--sakura-light)', borderRadius: 14,
            padding: '10px 18px', textAlign: 'right',
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--sakura-dark)' }}>
              ¥1 = {Number(currentRate.jpy_to_vnd).toLocaleString('vi-VN')}đ
            </div>
            <div className="text-gray text-xs mt-4">
              1.000đ = {(currentRate.vnd_to_jpy * 1000).toFixed(4)} JPY
            </div>
          </div>
        )}
      </div>

      {/* Thống kê nhanh */}
      {prediction?.stats && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: 10, marginBottom: 16,
        }}>
          {[
            { label:'Cao nhất 7 ngày', value:`${prediction.stats.max_7d}đ`,   bg:'#E8FFE8', color:'#2A8A2A' },
            { label:'Thấp nhất 7 ngày',value:`${prediction.stats.min_7d}đ`,   bg:'#FFF0F0', color:'#E05555' },
            { label:'Trung bình',       value:`${prediction.stats.avg_7d}đ`,   bg:'#E8F4FF', color:'#2A6AAA' },
            {
              label:'Thay đổi 7 ngày',
              value:`${prediction.stats.change_7d > 0 ? '+' : ''}${prediction.stats.change_7d}%`,
              bg: prediction.stats.change_7d >= 0 ? '#E8FFE8' : '#FFF0F0',
              color: prediction.stats.change_7d >= 0 ? '#2A8A2A' : '#E05555'
            },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: 12, padding: '10px 12px',
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Bộ lọc thời gian */}
      <div className="flex gap-8 mb-16" style={{ flexWrap: 'wrap' }}>
        {TIME_FILTERS.map(f => (
          <button key={f.value}
            onClick={() => setTimeFilter(f.value)}
            style={{
              padding: '6px 16px', borderRadius: 99, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s',
              background: timeFilter === f.value
                ? 'var(--sakura-dark)' : 'var(--gray-light)',
              color: timeFilter === f.value ? '#fff' : '#666',
            }}>
            {f.label}
          </button>
        ))}
        <button onClick={fetchAll} style={{
          marginLeft: 'auto', padding: '6px 14px',
          borderRadius: 99, border: '1px solid var(--sakura-light)',
          background: '#fff', cursor: 'pointer', fontSize: 12, color: '#888',
        }}>
          🔄 Làm mới
        </button>
      </div>

      {/* Biểu đồ */}
      {chartData.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 0' }}>
          <p className="text-gray text-sm">
            Chưa đủ dữ liệu cho khoảng thời gian này.<br/>
            Thử chọn khoảng thời gian dài hơn!
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFE4EC" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#888' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#888' }}
              tickLine={false}
              domain={['auto', 'auto']}
              tickFormatter={v => `${v}`}
              width={60}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12, border: '1px solid #FFB7C5',
                fontSize: 13, background: '#fff',
              }}
              formatter={(val, name) => [
                `${Number(val).toLocaleString('vi-VN')}đ`,
                name === 'rate' ? '📈 Thực tế' : '🔮 Dự đoán'
              ]}
            />
            <Legend
              formatter={val => val === 'rate' ? 'Tỷ giá thực tế' : 'Dự đoán'}
            />
            <Line
              type="monotone" dataKey="rate"
              stroke="#E8849A" strokeWidth={2.5}
              dot={false} activeDot={{ r: 5, fill: '#E8849A' }}
              name="rate"
            />
            {timeFilter === '7d' && (
              <Line
                type="monotone" dataKey="predicted"
                stroke={trendColor} strokeWidth={2}
                strokeDasharray="6 3"
                dot={{ fill: trendColor, r: 5 }}
                name="predicted"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Dự đoán — chỉ hiển thị khi chọn 7 ngày */}
      {timeFilter === '7d' && prediction?.predictions && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            🔮 Dự đoán 1–2 ngày tới
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {prediction.predictions.map(p => (
              <div key={p.step} style={{
                background: p.trend === 'increase' ? '#E8FFE8'
                  : p.trend === 'decrease' ? '#FFF0F0' : '#F5F5F5',
                borderRadius: 14, padding: '14px 16px',
                border: `1.5px solid ${p.trend === 'increase' ? '#B5D9B5'
                  : p.trend === 'decrease' ? '#FFB7B7' : '#E0E0E0'}`,
              }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{p.label}</div>
                <div style={{
                  fontSize: 18, fontWeight: 700,
                  color: p.trend === 'increase' ? '#4A8A4A'
                    : p.trend === 'decrease' ? '#E05555' : '#555'
                }}>
                  ¥1 ≈ {Number(p.predicted_jpy_to_vnd).toLocaleString('vi-VN')}đ
                </div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    background: p.trend === 'increase' ? '#4A8A4A'
                      : p.trend === 'decrease' ? '#E05555' : '#888',
                    color: '#fff', padding: '2px 8px',
                    borderRadius: 99, fontSize: 11,
                  }}>
                    {p.trend === 'increase' ? '▲ Tăng'
                      : p.trend === 'decrease' ? '▼ Giảm' : '→ Ổn định'}
                    {' '}{Math.abs(p.change_pct)}%
                  </span>
                  <span style={{ fontSize: 11, color: '#888' }}>
                    Tin cậy: {p.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#bbb', marginTop: 10, textAlign: 'center' }}>
            ⚠️ Chỉ mang tính tham khảo — dựa trên xu hướng tuyến tính 7 ngày
          </p>
        </div>
      )}
    </div>
  )
}