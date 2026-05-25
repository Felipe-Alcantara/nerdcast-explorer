import type { SortOrder } from '../types'
import { cx } from '../utils/cx'
import { BTN_CLS, INPUT_CLS } from './filterStyles'

interface Props {
  search: string
  onSearch: (value: string) => void
  sortOrder: SortOrder
  onSort: (value: SortOrder) => void
}

export function FilterSearchSort({ search, onSearch, sortOrder, onSort }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={search}
        onChange={event => onSearch(event.target.value)}
        placeholder="Buscar episódio..."
        className={cx(INPUT_CLS, 'flex-1 px-4')}
      />
      <button
        type="button"
        onClick={() => onSort(sortOrder === 'desc' ? 'asc' : 'desc')}
        className={BTN_CLS}
      >
        {sortOrder === 'desc' ? '↓ Mais recente' : '↑ Mais antigo'}
      </button>
    </div>
  )
}
