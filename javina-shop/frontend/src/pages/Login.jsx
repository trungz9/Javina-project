import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại!')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFE4EC 0%, #FFF0F5 50%, #E8F0FF 100%)',
      padding: 20,
    }}>
      {/* Decorations */}
      {['🌸','🌺','🌸','✿','🌷'].map((s, i) => (
        <div key={i} style={{
          position: 'fixed', fontSize: [32,24,20,28,18][i],
          top: ['10%','20%','70%','80%','50%'][i],
          left: ['5%','88%','3%','85%','92%'][i],
          opacity: 0.3, pointerEvents: 'none',
        }}>{s}</div>
      ))}

      <div style={{
        background: '#fff', borderRadius: 24,
        boxShadow: '0 8px 48px rgba(255,183,197,0.2)',
        padding: '40px 36px', width: '100%', maxWidth: 420,
        border: '1.5px solid #FFE4EC',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌸</div>
          <h1 style={{
            fontFamily: "'Zen Maru Gothic'",
            fontSize: 24, color: '#E8849A', marginBottom: 4,
          }}>Đăng nhập</h1>
          <p style={{ color: '#aaa', fontSize: 13 }}>Chào mừng bạn trở lại!</p>
        </div>

        {error && (
          <div style={{
            background: '#FFF0F0', border: '1px solid #FFB7C5',
            borderRadius: 10, padding: '10px 14px',
            color: '#E8849A', fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { name: 'email',    label: '📧 Email',      type: 'email',    ph: 'example@gmail.com' },
            { name: 'password', label: '🔒 Mật khẩu',   type: 'password', ph: '••••••••' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500,
                color: '#666', marginBottom: 6 }}>{f.label}</label>
              <input
                type={f.type} placeholder={f.ph} required
                value={form[f.name]}
                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                style={{
                  width: '100%', border: '1.5px solid #FFE4EC',
                  borderRadius: 12, padding: '11px 14px',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#FFB7C5'}
                onBlur={e => e.target.style.borderColor = '#FFE4EC'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', marginTop: 8,
            background: loading
              ? '#FFD4DF'
              : 'linear-gradient(135deg, #FFB7C5, #E8849A)',
            border: 'none', borderRadius: 14,
            padding: '13px', color: '#fff',
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(232,132,154,0.3)',
            transition: 'all 0.2s',
          }}>
            {loading ? '🌸 Đang đăng nhập...' : '🌸 Đăng nhập'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#aaa' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: '#E8849A', fontWeight: 600 }}>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}