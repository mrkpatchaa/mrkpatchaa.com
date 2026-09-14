import type { Project } from '@/lib/projects'

import Image from 'next/image'

export default function ProjectCard({ project }: { project: Project }) {
  const primaryLink = project.url || project.repo
  return (
    <article className="project-entry">
      <h2>
        {primaryLink ? (
          <a href={primaryLink}>
            {project.title}{' '}
            <span className="external-mark" aria-hidden="true">
              ↗
            </span>
          </a>
        ) : (
          project.title
        )}
      </h2>
      <div>
        <p>{project.description}</p>
        {project.image && (
          <Image src={project.image} alt={project.title} width={640} height={360} className="project-image" />
        )}
        {project.tags && (
          <ul className="project-tags" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <div className="project-actions">
          {project.repo && <a href={project.repo}>Source ↗</a>}
          {project.url && <a href={project.url}>Visit project ↗</a>}
        </div>
      </div>
    </article>
  )
}
