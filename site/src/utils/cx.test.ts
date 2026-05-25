import { describe, expect, it } from 'vitest'
import { cx } from './cx'

describe('cx', () => {
  it('joins truthy classes and drops empty conditional values', () => {
    expect(cx('base', false, 'active', null, undefined, 'px-2')).toBe('base active px-2')
  })
})
