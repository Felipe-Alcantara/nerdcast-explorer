import { BTN_CLS, SELECT_CLS } from './filterStyles'

interface Props {
  yearFrom: string
  onYearFrom: (value: string) => void
  yearTo: string
  onYearTo: (value: string) => void
  years: number[]
  onlyUnwatched: boolean
  onToggleUnwatched: () => void
  onlyLiked: boolean
  onToggleLiked: () => void
}

export function FilterPeriodActions({
  yearFrom,
  onYearFrom,
  yearTo,
  onYearTo,
  years,
  onlyUnwatched,
  onToggleUnwatched,
  onlyLiked,
  onToggleLiked,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs text-slate-500 shrink-0">Período:</span>
      <select value={yearFrom} onChange={event => onYearFrom(event.target.value)} className={SELECT_CLS}>
        <option value="">Desde</option>
        {[...years].reverse().map(year => (
          <option key={year} value={String(year)}>{year}</option>
        ))}
      </select>
      <span className="text-xs text-slate-500">até</span>
      <select value={yearTo} onChange={event => onYearTo(event.target.value)} className={SELECT_CLS}>
        <option value="">Hoje</option>
        {years.map(year => (
          <option key={year} value={String(year)}>{year}</option>
        ))}
      </select>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onToggleUnwatched}
        className={`${BTN_CLS} ${onlyUnwatched ? 'border-violet-500/50 text-violet-300 bg-violet-500/10' : ''}`}
      >
        {onlyUnwatched ? '✓ Só não ouvidos' : 'Só não ouvidos'}
      </button>
      <button
        type="button"
        onClick={onToggleLiked}
        className={`${BTN_CLS} ${onlyLiked ? 'border-rose-500/50 text-rose-300 bg-rose-500/10' : ''}`}
      >
        {onlyLiked ? '♥ Só curtidos' : 'Só curtidos'}
      </button>
    </div>
  )
}
