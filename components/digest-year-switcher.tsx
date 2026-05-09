import Link from 'next/link'

interface DigestYearSwitcherProps {
  years: number[]
  activeYear: number
  currentYear: number
}

export default function DigestYearSwitcher({ years, activeYear, currentYear }: DigestYearSwitcherProps) {
  return (
    <nav className="mb-8 flex flex-wrap gap-x-4 gap-y-2">
      {years.map((year) => {
        const isActive = year === activeYear
        const href = year === currentYear ? '/digest' : `/digest/${year}`
        return (
          <Link
            key={year}
            href={href}
            className={
              isActive
                ? 'font-semibold text-slate-900 underline underline-offset-4'
                : 'text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline'
            }
          >
            {year}
          </Link>
        )
      })}
    </nav>
  )
}
