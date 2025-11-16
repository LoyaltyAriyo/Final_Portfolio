import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client.js'

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Controlled inputs: update local component state whenever a field changes.
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      setIsSubmitting(true)
      // Call backend signup endpoint. Adjust the path if your API uses /auth/signup.
      await apiClient.post('/api/users', {
        name: form.name,
        email: form.email,
        password: form.password,
      })
      setSuccess('Account created! Redirecting to sign in...')
      // Optional: redirect to signin after a short delay (assuming /signin exists later).
      setTimeout(() => navigate('/signin'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container">
      <h2>Create an account</h2>
      <p style={{ color: '#9ca3af' }}>Sign up to manage your portfolio data.</p>

      <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 16, marginTop: 16 }}>
        {/* Each input is controlled: its value comes from state and updates via handleChange. */}
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Jane Doe"
            style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #374151', background: '#0b1222', color: 'white' }}
          />
        </label>

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
            minLength={6}
            placeholder="••••••••"
            style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #374151', background: '#0b1222', color: 'white' }}
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Repeat password"
            style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #374151', background: '#0b1222', color: 'white' }}
          />
        </label>

        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {success && <p style={{ color: '#10b981' }}>{success}</p>}

        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      {/* Submission flow explanation for future reference. */}
      <p style={{ marginTop: 16, color: '#9ca3af', fontSize: 14 }}>
        When you press submit, we validate the passwords locally, send the data to the backend using
        the shared apiClient, and show feedback based on the server response.
      </p>
    </main>
  )
}
