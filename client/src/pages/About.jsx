export default function About() {
    return (
        <main className="container">
            <h2>About me</h2>
            <p>
                My legal name is <strong>Amirhossein Mohammadi</strong>. I’m a Software Engineering Technician student in Toronto.
                I like building practical tools and clean, simple user experiences.
            </p>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <img src="/images/headshot.jpg" width="190" height="180" alt="Headshot" style={{ borderRadius: 16, border: '1px solid #1f2937' }} />
                <div>
                    <p style={{ color: '#9ca3af' }}>
                        Outside of class, I tinker with JavaScript/React, Python, and small bots for Discord/Telegram.
                        I’m also into astronomy-flavoured side projects and minimal UI.
                    </p>
                    <p>
                        <a className="btn" href="/resume.pdf" target="_blank" rel="noreferrer">View my Resume (PDF)</a>
                    </p>
                </div>
            </div>
        </main>
    )
}
