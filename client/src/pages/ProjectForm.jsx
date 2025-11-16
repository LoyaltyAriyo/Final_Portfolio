import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

const blankProject = {
  title: '',
  firstname: '',
  lastname: '',
  email: '',
  completion: '',
  description: ''
}

export default function ProjectForm() {
  const [form, setForm] = useState(blankProject)
  const [projects, setProjects] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState({ type: null, message: '' })
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin' // UI gate: only admins see the mutation form/buttons.

  // Load projects when the page mounts so the list mirrors the database.
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await apiClient.get('/api/projects')
      setProjects(data)
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Unable to load projects.' })
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
        await apiClient.put(`/api/projects/${editingId}`, form)
        setStatus({ type: 'success', message: 'Project updated.' })
      } else {
        await apiClient.post('/api/projects', form)
        setStatus({ type: 'success', message: 'Project added.' })
      }
      setForm(blankProject)
      setEditingId(null)
      await loadProjects()
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Save failed.' })
    }
  }

  const handleEdit = (project) => {
    // Switch into edit mode by copying the selected project into the form.
    setForm({
      title: project.title || '',
      firstname: project.firstname || '',
      lastname: project.lastname || '',
      email: project.email || '',
      completion: project.completion ? project.completion.slice(0, 10) : '',
      description: project.description || ''
    })
    setEditingId(project._id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await apiClient.del(`/api/projects/${id}`)
      if (editingId === id) {
        setEditingId(null)
        setForm(blankProject)
      }
      await loadProjects()
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Delete failed.' })
    }
  }

  return (
    <main className="container">
      <h2>Projects Admin</h2>
      <p style={{ color: '#9ca3af' }}>Use the form to add new projects or click edit/delete on an existing card.</p>
      <p style={{ marginTop: 8 }}>
        <Link to="/" className="nav-link">← Back to Home</Link>
      </p>

      {isAdmin ? (
        <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required placeholder="Weather Bot" />
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
          <textarea name="description" value={form.description} onChange={handleChange} required rows="3" placeholder="Tech stack, achievements, etc." />
        </label>
        {status.type && <p style={{ color: status.type === 'error' ? '#ef4444' : '#10b981' }}>{status.message}</p>}
        <button className="btn" type="submit">
          {editingId ? 'Update project' : 'Add project'}
        </button>
        </form>
      ) : (
        <p style={{ color: '#fcd34d', marginTop: 16 }}>
          Only admins can add or edit projects. You can still review the list below.
        </p>
      )}

      <section style={{ marginTop: 24 }}>
        <h3>Saved projects</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
          {projects.map((project) => (
            <li key={project._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <strong>{project.title}</strong>
                <p style={{ color: '#9ca3af', margin: '4px 0' }}>
                  {project.firstname} {project.lastname} • {project.email}
                </p>
                <small style={{ color: '#9ca3af' }}>
                  Completed {project.completion ? new Date(project.completion).toLocaleDateString() : '—'}
                </small>
                <p style={{ marginTop: 8 }}>{project.description}</p>
              </div>
              {isAdmin && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn" onClick={() => handleEdit(project)}>
                    Edit
                  </button>
                  <button type="button" className="btn" style={{ background: '#7f1d1d' }} onClick={() => handleDelete(project._id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
          {projects.length === 0 && <p style={{ color: '#9ca3af' }}>No projects yet.</p>}
        </ul>
      </section>
    </main>
  )
}
