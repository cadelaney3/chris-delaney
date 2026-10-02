import { resume } from '../resume'
import { site } from '../site'
import { useTitle } from '../useTitle'
import ExternalLink from '../ExternalLink'

export default function Resume() {
  useTitle('Resume')
  return (
    <article className="resume">
      <header className="resume-head">
        <div>
          <p className="eyebrow">Resume</p>
          <h1>{site.name}</h1>
          <p className="muted">
            {site.location} · <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.links.filter((l) => !l.href.startsWith('mailto:')).map((l) => (
              <span key={l.label}> · <ExternalLink href={l.href}>{l.label}</ExternalLink></span>
            ))}
          </p>
        </div>
        <button type="button" className="print-button" onClick={() => window.print()}>
          Print / save as PDF
        </button>
      </header>

      <section>
        <h2>Summary</h2>
        <p>{resume.summary}</p>
      </section>

      <section>
        <h2>Experience</h2>
        {resume.experience.map((job) => (
          <div key={job.company} className="job">
            <div className="job-head">
              <h3>{job.role} · {job.company}</h3>
              <span className="muted">{job.dates}</span>
            </div>
            <ul>
              {job.highlights.map((h) => (
                <li key={h.text}>
                  {h.title && <strong>{h.title}: </strong>}
                  {h.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Skills</h2>
        <dl className="skills">
          {resume.skills.map((s) => (
            <div key={s.group}>
              <dt>{s.group}</dt>
              <dd>{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Education</h2>
        <div className="job">
          <div className="job-head">
            <h3>{resume.education.school}</h3>
            <span className="muted">{resume.education.location}</span>
          </div>
          <p>{resume.education.degree}</p>
          <ul>
            {resume.education.details.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>
      </section>
    </article>
  )
}
