import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

export default function IndexPage({ ...props }) {
  const { data } = props
  const { edges: posts } = data.allMarkdownRemark

  return (
    <Layout>
      <SEO />
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-8 is-offset-2">
              {posts.map(({ node: post }) => (
                <div className="content" key={post.id} style={{ marginBottom: '3rem' }}>
                  <p className="is-marginless">
                    <span> &bull; </span>
                    <small>{post.frontmatter.date}</small>
                    <small className="is-pulled-right">~{post.frontmatter.readTime} mins</small>
                  </p>
                  <p>
                    <Link className="has-text-primary font-title title is-3 has-text-black-ter" to={post.fields.slug}>
                      {post.frontmatter.title}
                    </Link>
                  </p>
                  <p>{post.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            readTime
            date(formatString: "MMMM YYYY")
          }
        }
      }
    }
  }
`
