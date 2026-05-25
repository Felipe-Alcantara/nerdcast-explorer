import type { Episode, GuestFilterOption, SortOrder } from '../types'

export interface FilterEpisodesOptions {
  playlistOnly: boolean
  hasSelectedPlaylist: boolean
  playlistEpisodeIds: ReadonlySet<string>
  selectedProgram: string
  selectedTheme: string
  selectedGuest: string
  yearFrom: string
  yearTo: string
  search: string
  onlyUnwatched: boolean
  onlyLiked: boolean
  isWatched: (id: string) => boolean
  isLiked: (id: string) => boolean
  sortOrder: SortOrder
}

export function getEpisodeYears(episodes: Episode[]): number[] {
  const years = new Set(episodes.map(episode => episode.year).filter(Boolean) as number[])

  return Array.from(years).sort((a, b) => b - a)
}

export function getGuestFilterOptions(episodes: Episode[]): GuestFilterOption[] {
  const index = new Map<string, GuestFilterOption>()

  for (const episode of episodes) {
    for (const guest of episode.guests) {
      const name = guest.name.trim()
      const value = name.toLocaleLowerCase('pt-BR')

      if (!name || !value) {
        continue
      }

      const option = index.get(value)

      if (option) {
        option.count += 1
      } else {
        index.set(value, { name, value, count: 1 })
      }
    }
  }

  return Array.from(index.values()).sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  )
}

export function filterEpisodes(episodes: Episode[], options: FilterEpisodesOptions): Episode[] {
  let list = episodes

  if (options.playlistOnly && options.hasSelectedPlaylist) {
    list = list.filter(episode => options.playlistEpisodeIds.has(episode.id))
  }
  if (options.selectedProgram) {
    list = list.filter(episode => episode.program.slug === options.selectedProgram)
  }
  if (options.selectedTheme) {
    list = list.filter(episode => episode.theme === options.selectedTheme)
  }
  if (options.selectedGuest) {
    list = list.filter(episode =>
      episode.guests.some(guest => guest.name.trim().toLocaleLowerCase('pt-BR') === options.selectedGuest)
    )
  }
  if (options.yearFrom) {
    const yearFrom = Number.parseInt(options.yearFrom, 10)
    list = list.filter(episode => episode.year !== null && episode.year >= yearFrom)
  }
  if (options.yearTo) {
    const yearTo = Number.parseInt(options.yearTo, 10)
    list = list.filter(episode => episode.year !== null && episode.year <= yearTo)
  }

  const query = options.search.trim().toLocaleLowerCase('pt-BR')

  if (query) {
    list = list.filter(episode =>
      episode.title.toLocaleLowerCase('pt-BR').includes(query) ||
      episode.guests.some(guest => guest.name.toLocaleLowerCase('pt-BR').includes(query))
    )
  }
  if (options.onlyUnwatched) {
    list = list.filter(episode => !options.isWatched(episode.id))
  }
  if (options.onlyLiked) {
    list = list.filter(episode => options.isLiked(episode.id))
  }

  return [...list].sort((a, b) => {
    const comparison = a.date.localeCompare(b.date)

    return options.sortOrder === 'desc' ? -comparison : comparison
  })
}
