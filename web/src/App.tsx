import { useEffect } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router'
import { site } from './site'
import ExternalLink from './ExternalLink'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import PostPage from './pages/Post'
import Contact from './pages/Contact'
import Resume from './pages/Resume'
import NotFound from './pages/NotFound'

const year = new Date().getFullYear()

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <div className="page">
      <header className="site-header">
        <NavLink to="/" className="wordmark">{site.name}</NavLink>
        <nav>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/resume">Resume</NavLink>
          <NavLink to="/blog">Writing</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="resume" element={<Resume />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<PostPage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <span>© {year} {site.name}</span>
        <span className="footer-links">
          {site.links.map((l) => <ExternalLink key={l.label} href={l.href}>{l.label}</ExternalLink>)}
        </span>
      </footer>
    </div>
  )
}
