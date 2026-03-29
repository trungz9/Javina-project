import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const FIELDS = [
  { name: 'full_name',  label: '👤 Họ và tên',             type: 'text',     ph: 'Nguyễn Văn A',      required: true  },
  { name: 'username',   label: '🏷️ Tên đăng nhập',         type: 'text',     ph: 'username123',        required: true  },
  { name: 'email',      label: '📧 Email',                  type: 'email',    ph: 'example@gmail.com',  required: true  },
  { name: 'password',   label: '🔒 Mật khẩu',              type: 'password', ph: 'Ít nhất 6 ký tự',    required: true  },
  { name: 'university', label: '🏫 Trường đại học',         type: 'text',     ph: 'Đại học Bách Khoa',  required: false },
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
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #E8F0FF 0%, #FFF0F5 50%, #F0FFE8 100%)',
      padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24,
        boxShadow: '0 8px 48px rgba(168,200,232,0.2)',
        padding: '40px 36px', width: '100%', maxWidth: 440,
        border: '1.5px solid #E8F0FF',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌺</div>
          <h1 style={{
            fontFamily: "'Zen Maru Gothic'",
            fontSize: 24, color: '#7BA8C8', marginBottom: 4,
          }}>Tạo tài khoản</h1>
          <p style={{ color: '#aaa', fontSize: 13 }}>Tham gia cộng đồng sinh viên!</p>
        </div>

        {error && (
          <div style={{
            background: '#FFF0F0', border: '1px solid #FFB7C5',
            borderRadius: 10, padding: '10px 14px',
            color: '#E8849A', fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {FIELDS.map(f => (
            <div key={f.name} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
                color: '#666', marginBottom: 5 }}>{f.label}
                {!f.required && <span style={{ color: '#bbb', marginLeft: 4 }}>(tuỳ chọn)</span>}
              </label>
              <input
                type={f.type} placeholder={f.ph} required={f.required}
                value={form[f.name]}
                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                style={{
                  width: '100%', border: '1.5px solid #E8F0FF',
                  borderRadius: 12, padding: '10px 14px',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#A8C8E8'}
                onBlur={e => e.target.style.borderColor = '#E8F0FF'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', marginTop: 10,
            background: 'linear-gradient(135deg, #A8C8E8, #7BA8C8)',
            border: 'none', borderRadius: 14, padding: '13px',
            color: '#fff', fontWeight: 700, fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(168,200,232,0.4)',
          }}>
            {loading ? '🌺 Đang tạo tài khoản...' : '🌺 Đăng ký ngay'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#aaa' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#7BA8C8', fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}