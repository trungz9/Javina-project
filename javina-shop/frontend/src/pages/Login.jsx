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
    <div className="auth-page auth-page-sakura">
      {/* Decorations */}
      {['🌸','🌺','🌸','✿','🌷'].map((s, i) => (
        <div key={i} className="auth-deco" style={{
          fontSize: [32,24,20,28,18][i],
          top:  ['10%','20%','70%','80%','50%'][i],
          left: ['5%','88%','3%','85%','92%'][i],
        }}>{s}</div>
      ))}

      <div className="auth-card auth-card-sakura">
        <div className="auth-header">
          <div className="auth-emoji">🌸</div>
          <h1 className="auth-title-sakura">Đăng nhập</h1>
          <p className="auth-subtitle">Chào mừng bạn trở lại!</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { name:'email',    label:'📧 Email',    type:'email',    ph:'example@gmail.com' },
            { name:'password', label:'🔒 Mật khẩu', type:'password', ph:'••••••••'           },
          ].map(f => (
            <div key={f.name} className="form-group">
              <label className="form-label">{f.label}</label>
              <input
                type={f.type} placeholder={f.ph} required
                className="form-input"
                value={form[f.name]}
                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
              />
            </div>
          ))}

          <button type="submit" disabled={loading}
            className="btn btn-primary btn-full btn-lg mt-8">
            {loading ? '🌸 Đang đăng nhập...' : '🌸 Đăng nhập'}
          </button>
        </form>

        <p className="auth-footer-text">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="auth-footer-link-sakura">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}