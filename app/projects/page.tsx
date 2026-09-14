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
      <div className="page-heading">
        <p className="eyebrow accent">Side projects & open source</p>
        <h1 className="page-title">
          Things I’ve built
          <br />
          or contributed to.
        </h1>
      </div>
      <ProjectsGrid projects={projects} />
    </>
  )
}
