// Team page: simple grid of team members with skills
import './pages.css'

// Source of truth for displayed team members
const team = [
  { name: 'Alex Carter', role: 'Senior Web Developer', bio: 'Frontend architecture, performance, and DX.', skills: ['React', 'TypeScript', 'Vite'], image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=600&auto=format&fit=crop' },
  { name: 'Jordan Lee', role: 'Web Developer', bio: 'Interfaces that feel fast and intuitive.', skills: ['UI', 'CSS', 'Accessibility'], image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop' },
  { name: 'Sam Rodriguez', role: 'Filmmaker / Editor / Photographer', bio: 'Storytelling through moving and still images.', skills: ['Directing', 'Editing', 'Photography'], image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=600&auto=format&fit=crop' },
]

function Staff() {
  return (
    <div className="page">
      <h2>Our Team</h2>
      {/* Responsive three-column grid of profiles */}
      <div className="grid three">
        {team.map((member) => (
          <div className="card" key={member.name}>
            <img className="avatar-img" src={member.image} alt={member.name} />
            <h3>{member.name}</h3>
            <p className="muted">{member.role}</p>
            <p>{member.bio}</p>
            <div className="tags">
              {member.skills.map((s) => (
                <span className="tag" key={s}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Staff


