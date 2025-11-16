import { useState } from 'react'
import apiClient from '../api/client.js'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState({ type: null, message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Controlled inputs: local component state mirrors each field and updates on every keystroke.
  const update = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: null, message: '' })

    try {
      setIsSubmitting(true)
      // Trigger backend POST /api/contacts through the shared apiClient helper.
      await apiClient.post('/api/contacts', form)
      setStatus({ type: 'success', message: 'Message sent! I will get back to you shortly.' })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Unable to send message.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container">
      <h2>Contact</h2>
      <div className="card">
        <p style={{ color: '#9ca3af' }}>
          Reach me at <a href="mailto:amirhossein1384m@gmail.com">amirhossein1384m@gmail.com</a> or use the form.
        </p>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          <label>
            Name
            <input
              required
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Amirhossein"
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #374151', background: '#0b1222', color: 'white' }}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="amirhossein1384m@gmail.com"
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #374151', background: '#0b1222', color: 'white' }}
            />
          </label>
          <label>
            Message
            <textarea
              required
              name="message"
              value={form.message}
              onChange={update}
              rows="5"
              placeholder="Hi! I’d like to work with you on…"
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #374151', background: '#0b1222', color: 'white' }}
            />
          </label>
          {status.type === 'success' && <p style={{ color: '#10b981' }}>{status.message}</p>}
          {status.type === 'error' && <p style={{ color: '#ef4444' }}>{status.message}</p>}
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
      <div style={{ marginTop: 16, color: '#9ca3af' }}>
        <strong>Contact info panel</strong>
        <br />
        Toronto, Canada • Available for part-time/contract • <a href="mailto:amirhossein1384m@gmail.com">amirhossein1384m@gmail.com</a>
      </div>
    </main>
  )
}
