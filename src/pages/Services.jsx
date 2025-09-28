// Services overview: describes core offerings with bullet details
import './pages.css'

function Services() {
  return (
    <div className="page">
      <h2>Services</h2>
      {/* Two-column responsive grid of service categories */}
      <div className="grid two">
        <div className="card">
          <h3>Web Development</h3>
          <ul>
            <li>React SPA/MPA development</li>
            <li>Responsive UI and component libraries</li>
            <li>Performance optimization and SEO</li>
            <li>API integration and CMS setup</li>
          </ul>
        </div>
        <div className="card">
          <h3>Film, Editing & Photography</h3>
          <ul>
            <li>Pre-production, storyboarding, directing</li>
            <li>On-site filming with 4K equipment</li>
            <li>Editing, color grading, sound design</li>
            <li>Product and lifestyle photography</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Services


