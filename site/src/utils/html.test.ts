// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { sanitizeDescriptionHtml, stripHtml } from './html'

describe('stripHtml', () => {
  it('removes tags and decodes common entities', () => {
    expect(stripHtml('<p>NerdCast &amp; convidados&nbsp;<strong>top</strong></p>'))
      .toBe('NerdCast & convidados top')
  })
})

describe('sanitizeDescriptionHtml', () => {
  it('removes unsafe tags and attributes from external HTML', () => {
    const html = sanitizeDescriptionHtml(`
      <p onclick="alert(1)">Texto <strong>seguro</strong></p>
      <script>alert(1)</script>
      <iframe src="https://example.com"></iframe>
    `)

    expect(html).toContain('<p>Texto <strong>seguro</strong></p>')
    expect(html).not.toContain('onclick')
    expect(html).not.toContain('script')
    expect(html).not.toContain('iframe')
  })

  it('keeps only safe links and normalizes relative URLs', () => {
    const html = sanitizeDescriptionHtml(`
      <a href="/podcasts/nerdcast/teste" style="color:red">Relativo</a>
      <a href="javascript:alert(1)">Unsafe</a>
    `)

    expect(html).toContain('href="https://jovemnerd.com.br/podcasts/nerdcast/teste"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html).not.toContain('style=')
    expect(html).not.toContain('javascript:')
  })
})
