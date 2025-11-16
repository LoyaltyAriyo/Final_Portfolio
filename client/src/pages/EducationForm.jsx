import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

const blankForm = {
  title: '',
  firstname: '',
  lastname: '',
  email: '',
  completion: '',
  description: ''
}

export default function EducationForm() {
  const [form, setForm] = useState(blankForm)
  const [entries, setEntries] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState({ type: null, message: '' })
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin' // Only admins can perform write actions; others fall back to read-only lists.

  // Fetch the list on mount so the UI always reflects what's stored in MongoDB.
  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const data = await apiClient.get('/api/qualifications')
      setEntries(data)
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Unable to load education history.' })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: null, message: '' })

    try {
      if (editingId) {
        await apiClient.put(`/api/qualifications/${editingId}`, form)
        setStatus({ type: 'success', message: 'Education entry updated.' })
      } else {
        await apiClient.post('/api/qualifications', form)
        setStatus({ type: 'success', message: 'Education entry added.' })
      }
      setForm(blankForm)
      setEditingId(null)
      await loadEntries()
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Save failed.' })
    }
  }

  const handleEdit = (entry) => {
    // Pre-fill the form with the entry you selected, switching the component into "edit" mode.
    setForm({
      title: entry.title || '',
      firstname: entry.firstname || '',
      lastname: entry.lastname || '',
      email: entry.email || '',
      completion: entry.completion ? entry.completion.slice(0, 10) : '',
      description: entry.description || ''
    })
    setEditingId(entry._id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return
    try {
      await apiClient.del(`/api/qualifications/${id}`)
      if (editingId === id) {
        setEditingId(null)
        setForm(blankForm)
      }
      await loadEntries()
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Delete failed.' })
    }
  }

  return (
    <main className="container">
      <h2>Education / Qualifications</h2>
      <p style={{ color: '#9ca3af' }}>Manage your education history here. Use the list below to edit or delete entries.</p>
      <p style={{ marginTop: 8 }}>
        <Link to="/" className="nav-link">← Back to Home</Link>
      </p>

      {isAdmin ? (
        <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required placeholder="BSc Computer Science" />
        </label>
        <label>
          First name
          <input name="firstname" value={form.firstname} onChange={handleChange} required placeholder="Amirhossein" />
        </label>
        <label>
          Last name
          <input name="lastname" value={form.lastname} onChange={handleChange} required placeholder="Mohammadi" />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
        </label>
        <label>
          Completion date
          <input type="date" name="completion" value={form.completion} onChange={handleChange} required />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} required rows="3" placeholder="Coursework, GPA, etc." />
        </label>
        {status.type && <p style={{ color: status.type === 'error' ? '#ef4444' : '#10b981' }}>{status.message}</p>}
        <button className="btn" type="submit">
          {editingId ? 'Update entry' : 'Add entry'}
        </button>
        </form>
      ) : (
        <p style={{ color: '#fcd34d', marginTop: 16 }}>
          You are viewing education history in read-only mode. Sign in as an admin to add or update entries.
        </p>
      )}

      <section style={{ marginTop: 24 }}>
        <h3>Saved entries</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
          {entries.map((entry) => (
            <li key={entry._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{entry.title}</strong>
                <p style={{ color: '#9ca3af', margin: '4px 0' }}>
                  {entry.firstname} {entry.lastname} • {entry.email}
                </p>
                <small style={{ color: '#9ca3af' }}>
                  Completed {entry.completion ? new Date(entry.completion).toLocaleDateString() : '—'}
                </small>
                <p style={{ marginTop: 8 }}>{entry.description}</p>
              </div>
              {isAdmin && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn" onClick={() => handleEdit(entry)}>
                    Edit
                  </button>
                  <button type="button" className="btn" style={{ background: '#7f1d1d' }} onClick={() => handleDelete(entry._id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
          {entries.length === 0 && <p style={{ color: '#9ca3af' }}>No entries yet.</p>}
        </ul>
      </section>
    </main>
  )
}
