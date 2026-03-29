import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const FIELDS = [
  { name:'full_name',  label:'👤 Họ và tên',           type:'text',     ph:'Nguyễn Văn A',       required:true  },
  { name:'username',   label:'🏷️ Tên đăng nhập',       type:'text',     ph:'username123',         required:true  },
  { name:'email',      label:'📧 Email',                type:'email',    ph:'example@gmail.com',   required:true  },
  { name:'password',   label:'🔒 Mật khẩu',            type:'password', ph:'Ít nhất 6 ký tự',     required:true  },
  { name:'university', label:'🏫 Trường đại học',       type:'text',     ph:'Đại học Bách Khoa',   required:false },
]

export default function Register() {
  const [form, setForm]       = useState({ full_name:'', username:'', email:'', password:'', university:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại!')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page auth-page-sora">
      <div className="auth-card auth-card-sora">
        <div className="auth-header">
          <div className="auth-emoji">🌺</div>
          <h1 className="auth-title-sora">Tạo tài khoản</h1>
          <p className="auth-subtitle">Tham gia cộng đồng sinh viên!</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {FIELDS.map(f => (
            <div key={f.name} className="form-group">
              <label className="form-label">
                {f.label}
                {!f.required && <span className="text-gray" style={{ marginLeft: 4 }}>(tuỳ chọn)</span>}
              </label>
              <input
                type={f.type} placeholder={f.ph} required={f.required}
                className="form-input"
                value={form[f.name]}
                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
              />
            </div>
          ))}

          <button type="submit" disabled={loading}
            className="btn btn-sora btn-full btn-lg mt-8">
            {loading ? '🌺 Đang tạo tài khoản...' : '🌺 Đăng ký ngay'}
          </button>
        </form>

        <p className="auth-footer-text">
          Đã có tài khoản?{' '}
          <Link to="/login" className="auth-footer-link-sora">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}