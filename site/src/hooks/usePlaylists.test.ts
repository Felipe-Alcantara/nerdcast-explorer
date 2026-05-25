import { describe, expect, it } from 'vitest'
import { normalizePlaylists } from './usePlaylists'

describe('normalizePlaylists', () => {
  it('keeps valid playlists and removes duplicated episode ids', () => {
    expect(normalizePlaylists([
      {
        id: 'playlist-1',
        name: 'Favoritos',
        episodeIds: ['ep-1', 'ep-1', 'ep-2', 10],
      },
    ])).toEqual([
      {
        id: 'playlist-1',
        name: 'Favoritos',
        episodeIds: ['ep-1', 'ep-2'],
      },
    ])
  })

  it('drops invalid persisted entries', () => {
    expect(normalizePlaylists([
      null,
      { id: '', name: 'Sem id', episodeIds: ['ep-1'] },
      { id: 'playlist-2', name: '', episodeIds: ['ep-2'] },
      { id: 'playlist-3', name: 'Valida', episodeIds: 'ep-3' },
    ])).toEqual([
      {
        id: 'playlist-3',
        name: 'Valida',
        episodeIds: [],
      },
    ])
  })
})
