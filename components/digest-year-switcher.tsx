import Link from 'next/link'

interface DigestYearSwitcherProps {
  years: number[]
  activeYear: number
  currentYear: number
}

export default function DigestYearSwitcher({ years, activeYear, currentYear }: DigestYearSwitcherProps) {
  return (
    <nav className="year-nav" aria-label="Digest year">
      {years.map((year) => (
        <Link
          key={year}
          href={year === currentYear ? '/digest' : `/digest/${year}`}
          aria-current={year === activeYear ? 'page' : undefined}
        >
          {year}
        </Link>
      ))}
    </nav>
  )
}
