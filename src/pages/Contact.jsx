import './pages.css'

function Contact() {
  return (
    <div className="page">
      <div className="section">
        <h2>Contact Us</h2>
        <p className="muted">We typically respond within one business day.</p>
      </div>

      <div className="grid two-col gap-lg">
        <div className="card">
          <h3>Get in touch</h3>
          <ul className="list">
            <li><strong>Email:</strong> <a href="mailto:aidenwilliams336@gmail.com">aidenwilliams336@gmail.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:0672089491">067 208 9491</a></li>
            <li><strong>Hours:</strong> Mon–Fri, 9:00–17:00</li>
          </ul>
        </div>

        <div className="card">
          <h3>Visit</h3>
          <p>Were a distributed team. Book a video call and well send a link.</p>
          <a className="btn" href="/booking">Book a meeting</a>
        </div>
      </div>
    </div>
  )
}

export default Contact


