// Portfolio: small showcase grid of representative work
import './pages.css'

// Data for showcase items rendered below
const work = [
  { title: 'Ecommerce Launch', type: 'Web', desc: 'High-converting storefront with blazing Lighthouse scores.' },
  { title: 'Brand Film', type: 'Film', desc: '2-minute hero film for a tech brand launch.' },
  { title: 'Product Photography', type: 'Photo', desc: 'Clean, consistent product set for catalog and ads.' },
]

function Portfolio() {
  return (
    <div className="page">
      <h2>Selected Work</h2>
      {/* Responsive three-column grid of case cards */}
      <div className="grid three">
        {work.map((w) => (
          <div className="card" key={w.title}>
            <div className="badge">{w.type}</div>
            <h3>{w.title}</h3>
            <p>{w.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Portfolio


