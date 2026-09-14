import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page-heading">
      <p className="eyebrow accent">404</p>
      <h1 className="page-title">Page not found.</h1>
      <p>
        This page may have moved.{' '}
        <Link className="text-link" href="/">
          Back to the notebook →
        </Link>
      </p>
    </div>
  )
}
