import Image from 'next/image'

import { ArrowSquareOut, GithubLogo } from '@phosphor-icons/react/dist/ssr'

import type { Project } from '@/lib/projects'

export default function ProjectCard({ project }: { project: Project }) {
  const primaryLink = project.url || project.repo

  return (
    <div className="flex flex-col gap-4">
      {project.image && (
        <div className="relative h-48 w-full overflow-hidden rounded-sm">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold leading-snug">
          {primaryLink ? (
            <a href={primaryLink} target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:underline">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="text-lg leading-relaxed text-slate-700">{project.description}</p>
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-sm bg-slate-100 px-2 py-0.5 text-sm text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        )}
        {(project.repo || project.url) && (
          <div className="mt-1 flex gap-4">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
              >
                <GithubLogo size={18} />
                <span>Source</span>
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
              >
                <ArrowSquareOut size={18} />
                <span>Live</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
