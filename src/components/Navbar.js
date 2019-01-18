import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import twitter from 'simple-icons/icons/twitter'
import github from 'simple-icons/icons/github'
import rss from 'simple-icons/icons/rss'
import linkedin from 'simple-icons/icons/linkedin'
import logo from '../img/Logo.png'

const query = graphql`
  query {
    site {
      siteMetadata {
        social {
          twitter
          github
          linkedin
        }
      }
    }
  }
`
class Navbar extends React.Component {
  componentDidMount() {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
      // Add a click event on each of them
      $navbarBurgers.forEach(el => {
        el.addEventListener('click', () => {
          // Get the target from the "data-target" attribute
          const target = el.dataset.target
          const $target = document.getElementById(target)
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active')
          $target.classList.toggle('is-active')
        })
      })
    }
  }

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => {
          const { siteMetadata } = data.site
          return (
            <nav className="navbar is-transparent" role="navigation" aria-label="main-navigation">
              <div className="container">
                <div className="columns" style={{ width: '100%', marginLeft: 0, marginRight: 0 }}>
                  <div className="column is-8 is-offset-2 is-flex">
                    <div className="navbar-brand">
                      <Link to="/" className="navbar-item" title="">
                        <img src={logo} alt="ꝚṀḴ" />
                      </Link>
                      {/* Hamburger menu */}
                      <div className="navbar-burger burger" data-target="navMenu">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                    <div id="navMenu" className="navbar-menu">
                      <div className="navbar-start has-text-centered">
                        <Link className="navbar-item" to="/about">
                          About
                        </Link>
                      </div>
                      <div className="navbar-end has-text-centered">
                        <a className="navbar-item" href="/rss.xml" target="_blank" rel="noopener noreferrer">
                          <span
                            className="icon"
                            style={{ color: '#263238' }}
                            dangerouslySetInnerHTML={{ __html: rss.svg }}
                          />
                        </a>
                        <a
                          className="navbar-item"
                          href={`https://github.com/${siteMetadata.social.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className="icon"
                            style={{ color: '#263238' }}
                            dangerouslySetInnerHTML={{ __html: github.svg }}
                          />
                        </a>
                        <a
                          className="navbar-item"
                          href={`https://twitter.com/${siteMetadata.social.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className="icon"
                            style={{ color: '#55acee' }}
                            dangerouslySetInnerHTML={{ __html: twitter.svg }}
                          />
                        </a>
                        <a
                          className="navbar-item"
                          href={`https://www.linkedin.com/in/${siteMetadata.social.linkedin}/?locale=en_US`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className="icon"
                            style={{ color: '#0077B5' }}
                            dangerouslySetInnerHTML={{ __html: linkedin.svg }}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          )
        }}
      />
    )
  }
}

export default Navbar
