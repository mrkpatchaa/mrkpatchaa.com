import ProjectsGrid from '@/components/projects-grid'
import { projects } from '@/lib/projects'

export const generateMetadata = async () => {
  return {
    title: 'Projects',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/projects`,
    },
  }
}

export default function ProjectsPage() {
  return (
    <>
      <h1 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">Projects</h1>
      <ProjectsGrid projects={projects} />
    </>
  )
}
