const services = [
    { title: 'Web development', blurb: 'React + simple backends for small apps and dashboards.' },
    { title: 'APIs & integrations', blurb: 'REST APIs, third-party services, and simple automations.' },
    { title: 'UI clean-ups', blurb: 'Minimal, readable interfaces with better copy.' }
]

export default function Services() {
    return (
        <main className="container">
            <h2>Services</h2>
            <div className="grid">
                {services.map(s => (
                    <section className="card" key={s.title}>
                        <h3>{s.title}</h3>
                        <p style={{ color: '#9ca3af' }}>{s.blurb}</p>
                    </section>
                ))}
            </div>
        </main>
    )
}
