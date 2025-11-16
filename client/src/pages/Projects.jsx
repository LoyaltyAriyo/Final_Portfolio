import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'

const fallbackProjects = [
  {
    title: 'SkyWise — weather insights bot',
    img: '/images/weather.jpg',
    desc: 'A small bot that gives daily weather and tips on request. Built with JS/Node + simple APIs.',
    role: 'Creator • Frontend/Backend'
  },
  {
    title: 'ParkVision — parking spot detector (school project)',
    img: '/images/parking.jpg',
    desc: 'Prototype to detect open parking spots; involved data modeling and UI planning.',
    role: 'Contributor • Modeling/Docs'
  },
  {
    title: 'Telescope Scheduler — planning tool',
    img: '/images/telescope.jpg',
    desc: 'A concept for scheduling observations under constraints (weather, moon phase, targets).',
    role: 'Creator • Prototype'
  }
]

export default function Projects() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    // Example usage of the shared apiClient helper: automatically attaches the JWT header.
    apiClient
      .get('/api/projects')
      .then((data) => {
        if (!active || !Array.isArray(data)) return

        // Normalize data so missing images/descriptions don’t break the UI.
        const normalized = data.map((p, idx) => ({
          title: p.title || `Project ${idx + 1}`,
          desc: p.description || p.desc || 'Project details coming soon.',
          role: p.role || 'Contributor',
          img: p.img || '/images/telescope.jpg', // fallback image lives in /public/images
        }))

        // If there are few projects in the DB, pad with the sample cards so the grid isn’t sparse.
        const padded = normalized.length >= fallbackProjects.length
          ? normalized
          : [...normalized, ...fallbackProjects.slice(0, fallbackProjects.length - normalized.length)]

        setProjects(padded)
      })
      .catch((err) => {
        if (!active) return
        // If the API is protected or fails, keep showing the fallback cards so the page isn’t empty.
        setError(err.message || 'Unable to load projects; showing defaults.')
        setProjects(fallbackProjects)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="container">
      <h2>Projects</h2>
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      <div className="grid">
        {projects.map((p, idx) => (
          <article className="card" key={p.title || idx}>
            {p.img ? (
              <img
                src={p.img}
                alt=""
                width="100%"
                height="140"
                style={{ objectFit: 'cover', borderRadius: 12, border: '1px solid #1f2937' }}
                onError={(e) => {
                  e.currentTarget.src = '/images/telescope.jpg' // ensure a visible fallback if the URL 404s
                }}
              />
            ) : (
              <div
                style={{
                  height: 140,
                  borderRadius: 12,
                  border: '1px solid #1f2937',
                  background: 'linear-gradient(135deg, #1f2937, #0f172a)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#9ca3af',
                  fontWeight: 600,
                  letterSpacing: '.02em'
                }}
              >
                Project
              </div>
            )}
            <h3>{p.title}</h3>
            <p style={{ color: '#9ca3af' }}>{p.desc}</p>
            <p style={{ fontSize: 14, color: '#9ca3af' }}>
              <em>{p.role}</em>
            </p>
          </article>
        ))}
      </div>
    </main>
  )
}
