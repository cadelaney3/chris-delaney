import type { Project } from './site'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project">
      <div className="project-head">
        <h3>{project.name}</h3>
        <span className="muted">{project.year}</span>
      </div>
      <p>{project.description}</p>
      <div className="project-foot">
        <ul className="tags">
          {project.tech.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <span className="project-links">
          {project.links.map((l) => <a key={l.label} href={l.href}>{l.label} ↗</a>)}
        </span>
      </div>
    </article>
  )
}
