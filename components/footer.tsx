import { SOCIAL } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} mrkpatchaa</span>
          <nav aria-label="Social and feed links">
            <a href={`https://github.com/${SOCIAL.github}`}>GitHub</a>
            <a href={`https://linkedin.com/in/${SOCIAL.linkedin}`}>LinkedIn</a>
            <a href={`https://twitter.com/${SOCIAL.twitter}`}>X</a>
            <a href="/feed.xml">RSS</a>
          </nav>
        </div>
        <p className="footer-wordmark" aria-hidden="true">
          mrkpatchaa
        </p>
      </div>
    </footer>
  )
}
