import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getPosts, formatDate, type PostMeta } from '../api'
import { projects, site } from '../site'
import { useTitle } from '../useTitle'
import ProjectCard from '../ProjectCard'
import ExternalLink from '../ExternalLink'

export default function Home() {
  useTitle()
  const [posts, setPosts] = useState<PostMeta[] | null>(null)

  useEffect(() => {
    getPosts().then(setPosts).catch(() => setPosts([]))
  }, [])

  return (
    <>
      <section className="intro">
        <h1>{site.tagline}</h1>
        {site.bio.map((p) => <p key={p}>{p}</p>)}
        <p className="links">
          {site.links.map((l) => <ExternalLink key={l.label} href={l.href}>{l.label} ↗</ExternalLink>)}
        </p>
      </section>

      <section>
        <div className="section-head">
          <h2>Selected projects</h2>
          <Link to="/projects">All projects →</Link>
        </div>
        <div className="project-list">
          {projects.slice(0, 2).map((p) => <ProjectCard key={p.name} project={p} />)}
        </div>
      </section>

      {posts && posts.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Recent writing</h2>
            <Link to="/blog">All posts →</Link>
          </div>
          <ul className="post-list">
            {posts.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                <time dateTime={p.date}>{formatDate(p.date)}</time>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
