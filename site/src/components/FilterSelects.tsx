import type { GuestFilterOption, Program, Theme } from '../types'
import { cx } from '../utils/cx'
import { SELECT_CLS } from './filterStyles'

interface Props {
  selectedProgram: string
  onProgram: (value: string) => void
  selectedTheme: string
  onTheme: (value: string) => void
  selectedGuest: string
  onGuest: (value: string) => void
  programs: Program[]
  themes: Theme[]
  guests: GuestFilterOption[]
}

export function FilterSelects({
  selectedProgram,
  onProgram,
  selectedTheme,
  onTheme,
  selectedGuest,
  onGuest,
  programs,
  themes,
  guests,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <select value={selectedProgram} onChange={event => onProgram(event.target.value)} className={cx(SELECT_CLS, 'flex-1 min-w-45')}>
        <option value="">Todos os programas</option>
        {programs.map(program => (
          <option key={program.slug} value={program.slug}>
            {program.name}{program.count ? ` (${program.count})` : ''}
          </option>
        ))}
      </select>

      <select value={selectedTheme} onChange={event => onTheme(event.target.value)} className={cx(SELECT_CLS, 'flex-1 min-w-45')}>
        <option value="">Todos os temas</option>
        {themes.map(theme => (
          <option key={theme.slug} value={theme.name}>{theme.name}</option>
        ))}
      </select>

      <select value={selectedGuest} onChange={event => onGuest(event.target.value)} className={cx(SELECT_CLS, 'flex-1 min-w-45')}>
        <option value="">Todos os convidados</option>
        {guests.map(guest => (
          <option key={guest.value} value={guest.value}>
            {guest.name} ({guest.count})
          </option>
        ))}
      </select>
    </div>
  )
}
