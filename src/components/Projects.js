import React from 'react'
import PropTypes from 'prop-types'
import { v4 } from 'uuid'

const Projects = ({ projects }) => (
  <div>
    {projects.map(project => (
      <article key={v4()} className="message">
        <div className="message-body">
          {project.title}
          <br />
          <cite> – {project.description}</cite>
        </div>
      </article>
    ))}
  </div>
)

Projects.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      quote: PropTypes.string,
      author: PropTypes.string,
    })
  ),
}

export default Projects
