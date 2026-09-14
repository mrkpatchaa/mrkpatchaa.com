'use client'

import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'

export interface SearchItem {
  title: string
  href: string
  kind: string
}

export default function SiteControls({ items }: { items: SearchItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const open = () => {
    dialog.current?.showModal()
    input.current?.focus()
  }
  const close = () => {
    dialog.current?.close()
  }

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [])

  function toggleTheme() {
    const next = document.documentElement.dataset.theme !== 'dark'
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    try {
      localStorage.setItem('mrk-theme', next ? 'dark' : 'light')
    } catch {}
  }

  const results = items.filter((item) => item.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  return (
    <div className="site-controls">
      <button ref={trigger} className="search-trigger" onClick={open} aria-haspopup="dialog">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </svg>
        <span>Search</span>
        <kbd aria-hidden="true">⌘K</kbd>
      </button>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle color theme">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" />
        </svg>
      </button>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby="search-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
        onClose={() => {
          setQuery('')
          trigger.current?.focus()
        }}
      >
        <div className="search-panel">
          <div className="search-heading">
            <h2 id="search-title">Search the notebook</h2>
            <button onClick={close} aria-label="Close search">
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <label className="sr-only" htmlFor="site-search">
            Search articles, digests, and projects
          </label>
          <input
            ref={input}
            id="site-search"
            type="search"
            placeholder="Articles, digests, projects…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p className="search-count" role="status">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
          <ul className="search-results">
            {results.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close}>
                  <span className="eyebrow">{item.kind}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          {results.length === 0 && <p className="empty-state">No matches. Try another word.</p>}
        </div>
      </dialog>
    </div>
  )
}
