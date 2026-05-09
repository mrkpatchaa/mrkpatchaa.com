import ProjectCard from './project-card'

import type { Project } from '@/lib/projects'

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="mb-32 grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  )
}
