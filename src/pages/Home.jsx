// Landing page: hero with primary CTAs and quick service highlights
import { Link } from 'react-router-dom'
import './pages.css'

function Home() {
  return (
    <div className="page">
      {/* Hero section with tagline and primary actions */}
      <section className="hero">
        <h1 className="hero-title">Design. Build. Film. Deliver.</h1>
        <p className="hero-sub">SOT Agency crafts high-performance websites and cinematic content that convert.</p>
        <div className="hero-cta">
          <Link className="btn primary" to="/booking">Book a Meeting</Link>
          <Link className="btn" to="/portfolio">View Our Work</Link>
        </div>
      </section>

      {/* Quick service highlights */}
      <section className="features">
        <div className="feature">
          <h3>Web Development</h3>
          <p>Modern, fast, and accessible web apps using React, TypeScript, and best practices.</p>
        </div>
        <div className="feature">
          <h3>Film & Editing</h3>
          <p>End-to-end video production: directing, shooting, and post for brand stories.</p>
        </div>
        <div className="feature">
          <h3>Photography</h3>
          <p>Product, lifestyle, and event photography tailored to your brand.</p>
        </div>
      </section>
    </div>
  )
}

export default Home


