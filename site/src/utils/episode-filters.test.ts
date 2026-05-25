import { describe, expect, it } from 'vitest'
import type { Episode } from '../types'
import { filterEpisodes, getEpisodeYears, getGuestFilterOptions } from './episode-filters'

function makeEpisode(overrides: Partial<Episode>): Episode {
  return {
    id: 'episode',
    wp_id: 1,
    slug: '',
    url: '',
    title: '',
    description: '',
    date: '2026-01-01',
    year: 2026,
    month: 1,
    episode_number: null,
    duration_seconds: null,
    program: { slug: 'nerdcast', name: 'NerdCast' },
    theme: null,
    image: '',
    audio: { high: '', medium: '', low: '', zip: '' },
    guests: [],
    ...overrides,
  }
}

const episodes = [
  makeEpisode({
    id: '1',
    title: 'Marvel no cinema',
    date: '2026-05-22',
    year: 2026,
    month: 5,
    theme: 'Séries',
    guests: [{ id: 1, name: 'Carlos Voltor', twitter: '', photo: '' }],
  }),
  makeEpisode({
    id: '2',
    title: 'Tecnologia na prática',
    date: '2025-04-10',
    year: 2025,
    month: 4,
    program: { slug: 'nerdtech', name: 'NerdTech' },
    theme: 'Tecnologia',
    guests: [
      { id: 2, name: 'Natália Kreuser', twitter: '', photo: '' },
      { id: 3, name: 'Carlos Voltor', twitter: '', photo: '' },
    ],
  }),
  makeEpisode({
    id: '3',
    title: 'RPG especial',
    date: '2024-03-01',
    year: 2024,
    month: 3,
    guests: [{ id: 4, name: 'Marcelo Bassoli', twitter: '', photo: '' }],
  }),
]

function defaultOptions() {
  return {
    playlistOnly: false,
    hasSelectedPlaylist: false,
    playlistEpisodeIds: new Set<string>(),
    selectedProgram: '',
    selectedTheme: '',
    selectedGuest: '',
    yearFrom: '',
    yearTo: '',
    search: '',
    onlyUnwatched: false,
    onlyLiked: false,
    isWatched: () => false,
    isLiked: () => false,
    sortOrder: 'desc' as const,
  }
}

describe('episode-filters', () => {
  it('returns available years in descending order', () => {
    expect(getEpisodeYears([...episodes, makeEpisode({ id: 'no-year', year: null })])).toEqual([2026, 2025, 2024])
  })

  it('indexes guests by normalized name and counts appearances', () => {
    expect(getGuestFilterOptions(episodes)).toEqual([
      { name: 'Carlos Voltor', value: 'carlos voltor', count: 2 },
      { name: 'Marcelo Bassoli', value: 'marcelo bassoli', count: 1 },
      { name: 'Natália Kreuser', value: 'natália kreuser', count: 1 },
    ])
  })

  it('filters by program, theme, guest, years and search text', () => {
    const result = filterEpisodes(episodes, {
      ...defaultOptions(),
      selectedProgram: 'nerdtech',
      selectedTheme: 'Tecnologia',
      selectedGuest: 'carlos voltor',
      yearFrom: '2025',
      yearTo: '2025',
      search: 'prática',
    })

    expect(result.map(episode => episode.id)).toEqual(['2'])
  })

  it('combines playlist, watched and liked filters', () => {
    const result = filterEpisodes(episodes, {
      ...defaultOptions(),
      playlistOnly: true,
      hasSelectedPlaylist: true,
      playlistEpisodeIds: new Set(['2', '3']),
      onlyUnwatched: true,
      onlyLiked: true,
      isWatched: id => id === '3',
      isLiked: id => id === '2',
    })

    expect(result.map(episode => episode.id)).toEqual(['2'])
  })

  it('sorts episodes by publication date', () => {
    expect(filterEpisodes(episodes, defaultOptions()).map(episode => episode.id)).toEqual(['1', '2', '3'])
    expect(filterEpisodes(episodes, { ...defaultOptions(), sortOrder: 'asc' }).map(episode => episode.id)).toEqual(['3', '2', '1'])
  })
})
