import type { Project } from './site'
import ExternalLink from './ExternalLink'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project">
      <div className="project-head">
        <h3>{project.name}</h3>
        <span className="muted">{project.context}</span>
      </div>
      <p>{project.description}</p>
      <div className="project-foot">
        <ul className="tags">
          {project.tech.map((t) => <li key={t}>{t}</li>)}
        </ul>
        {project.links.length > 0 && (
          <span className="project-links">
            {project.links.map((l) => <ExternalLink key={l.label} href={l.href}>{l.label} ↗</ExternalLink>)}
          </span>
        )}
      </div>
    </article>
  )
}
