import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    full_name: '', university: ''
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng ký tài khoản</h1>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'full_name',   placeholder: 'Họ và tên',       type: 'text'     },
            { name: 'username',    placeholder: 'Tên đăng nhập',   type: 'text'     },
            { name: 'email',       placeholder: 'Email',           type: 'email'    },
            { name: 'password',    placeholder: 'Mật khẩu',        type: 'password' },
            { name: 'university',  placeholder: 'Trường đại học (tuỳ chọn)', type: 'text' },
          ].map(f => (
            <input key={f.name}
              type={f.type} name={f.name} placeholder={f.placeholder}
              value={form[f.name]} onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required={f.name !== 'university'}
            />
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-500">
          Đã có tài khoản?{' '}
          <a href="/login" className="text-orange-500 hover:underline">Đăng nhập</a>
        </p>
      </div>
    </div>
  )
}