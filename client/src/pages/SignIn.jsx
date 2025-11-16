import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  // Keep inputs controlled by mirroring their values in component state.
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      setIsSubmitting(true)
      // POST /auth/signin returns { token, user }
      const data = await apiClient.post('/auth/signin', form)
      login(data) // Store token + user in context/localStorage so the entire app knows we're signed in.
      navigate('/') // Redirect to home (or dashboard) after successful login.
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container">
      <h2>Sign In</h2>
      <p style={{ color: '#9ca3af' }}>Access your portfolio admin features.</p>
      <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 16, marginTop: 16 }}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="jane@example.com"
            style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #374151', background: '#0b1222', color: 'white' }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #374151', background: '#0b1222', color: 'white' }}
          />
        </label>

        {error && <p style={{ color: '#ef4444' }}>{error}</p>}

        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Comment to explain how signin works for future reference. */}
      <p style={{ marginTop: 16, color: '#9ca3af', fontSize: 14 }}>
        On submit we POST your credentials to the backend, store the returned token/user in AuthContext (which also persists them in
        localStorage), then navigate away once authenticated.
      </p>
    </main>
  )
}
