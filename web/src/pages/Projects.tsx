import { projects } from '../site'
import { useTitle } from '../useTitle'
import ProjectCard from '../ProjectCard'

export default function Projects() {
  useTitle('Projects')
  return (
    <section>
      <h1>Projects</h1>
      <p className="lede">Things I've built, shipped, or tinkered with.</p>
      <div className="project-list">
        {projects.map((p) => <ProjectCard key={p.name} project={p} />)}
      </div>
    </section>
  )
}
