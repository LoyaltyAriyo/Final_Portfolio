import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Simple home page with quick access links to admin panels when signed in as admin.
export default function Home() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <main>
      <section className="hero">
        <div className="container">
          <p style={{ color: '#14b8a6', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
            Portfolio • Full Stack
          </p>
          <h1 style={{ marginTop: 8 }}>Hi, I’m Amirhossein — building useful experiences on the web.</h1>
          <p style={{ color: '#9ca3af', maxWidth: 720, marginTop: 12 }}>
            Browse my work, see my background, and get in touch. If you’re signed in as admin, you can manage projects and education entries directly.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <Link to="/projects" className="btn">View Projects</Link>
            <Link to="/contact" className="btn" style={{ background: '#1f2937', color: 'white', boxShadow: 'none' }}>Contact Me</Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ marginTop: -32 }}>
        {isAdmin && (
          <div className="card" style={{ borderColor: '#14b8a6', boxShadow: '0 10px 30px rgba(20, 184, 166, .18)' }}>
            <strong style={{ color: '#14b8a6' }}>Admin shortcuts</strong>
            <p style={{ color: '#9ca3af', margin: '6px 0 12px' }}>You’re signed in as an admin. Jump into edit mode here:</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/manage/projects" className="btn">Manage Projects</Link>
              <Link to="/manage/education" className="btn" style={{ background: '#1f2937', color: 'white', boxShadow: 'none' }}>Manage Qualifications</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
