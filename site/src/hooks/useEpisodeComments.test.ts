import { describe, expect, it } from 'vitest'
import { MAX_EPISODE_COMMENT_LENGTH, normalizeEpisodeComments } from './useEpisodeComments'

describe('normalizeEpisodeComments', () => {
  it('keeps valid comments keyed by episode id', () => {
    expect(normalizeEpisodeComments({
      ' ep-1 ': '  00:42 momento engracado  ',
      'ep-2': 'Linha 1\r\nLinha 2',
    })).toEqual({
      'ep-1': '00:42 momento engracado',
      'ep-2': 'Linha 1\nLinha 2',
    })
  })

  it('drops invalid or empty comments', () => {
    expect(normalizeEpisodeComments({
      '': 'sem episodio',
      'ep-1': '',
      'ep-2': '   ',
      'ep-3': 42,
    })).toEqual({})
  })

  it('caps persisted comments to the maximum length', () => {
    const longComment = 'a'.repeat(MAX_EPISODE_COMMENT_LENGTH + 10)

    expect(normalizeEpisodeComments({ 'ep-1': longComment })['ep-1']).toHaveLength(MAX_EPISODE_COMMENT_LENGTH)
  })
})
