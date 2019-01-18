import React from 'react'
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import { graphql, Link } from 'gatsby'
import { DiscussionEmbed } from 'disqus-react'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import SEO from '../components/SEO'

export const BlogPostTemplate = ({ content, contentComponent, description, tags, title, date, id, social }) => {
  const PostContent = contentComponent || Content

  return (
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <p className="is-marginless">
              <span> &bull; </span>
              <small>{date}</small>
            </p>
            <h1 className="title is-size-3 has-text-weight-bold" style={{ marginBottom: '2rem', marginTop: 0 }}>
              {title}
            </h1>
            <p>{description}</p>
            <PostContent content={content} />
            {tags && tags.length ? (
              <div className="is-sr-only">
                <h4>Tags</h4>
                <ul className="taglist">
                  {tags.map(tag => (
                    <li key={`${tag}tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <DiscussionEmbed
              shortname={social.disqus}
              config={{ identifier: id, title: `${title} by @${social.twitter}` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
}

const BlogPost = ({ data }) => {
  const {
    markdownRemark: post,
    site: {
      siteMetadata: { social },
    },
  } = data

  return (
    <Layout>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description} slug={post.fields.slug} />
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        id={post.id}
        date={post.frontmatter.date}
        social={social}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
      fields {
        slug
      }
    }
    site {
      siteMetadata {
        social {
          disqus
          twitter
        }
      }
    }
  }
`
