import type { Project } from '@/lib/projects'

import ProjectCard from './project-card'

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="project-list">
      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  )
}
