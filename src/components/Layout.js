import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
// import 'typeface-barlow'
import 'typeface-fira-mono'

import Navbar from './Navbar'
import './all.sass'
import './prism.sass'

const TemplateWrapper = ({ children }) => (
  <StaticQuery
    query={graphql`
      query HeadingQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={() => (
      <>
        <Navbar />
        <div>{children}</div>
      </>
    )}
  />
)

export default TemplateWrapper
