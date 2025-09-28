// App shell: navigation, theme toggle, page outlet, footer, and global chat agent
import { Outlet, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Layout.css'
import ChatAgent from './ChatAgent'

function Layout() {
  // Persisted theme state; respects system preference on first load
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const initial = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(initial)
  }, [])

  useEffect(() => {
    // Apply theme to <html> for CSS variables and persist in localStorage
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">SOT Agency</div>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Services</NavLink>
            <NavLink to="/staff" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Staff</NavLink>
            <NavLink to="/portfolio" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Work</NavLink>
            <NavLink to="/booking" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Book a Meeting</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink>
          </nav>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'light' ? '🌙' : '☀️'}</button>
        </div>
      </header>

      <main className="site-main container">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>© {new Date().getFullYear()} SOT Agency</div>
          <div className="footer-links">
            <a href="mailto:aidenwilliams336@gmail.com">aidenwilliams336@gmail.com</a>
            <a href="/booking">Schedule</a>
          </div>
        </div>
      </footer>
      <ChatAgent />
    </div>
  )
}

export default Layout


