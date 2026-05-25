const allowedDescriptionTags = new Set([
  'a',
  'b',
  'blockquote',
  'br',
  'div',
  'em',
  'h2',
  'h3',
  'h4',
  'i',
  'li',
  'ol',
  'p',
  'span',
  'strong',
  'u',
  'ul',
])

function normalizeSafeHref(rawHref: string): string {
  const href = rawHref.trim()

  if (!href) {
    return ''
  }

  if (href.startsWith('/')) {
    return `https://jovemnerd.com.br${href}`
  }

  try {
    const url = new URL(href)
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.toString() : ''
  } catch {
    return ''
  }
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function sanitizeDescriptionHtml(html: string): string {
  if (!html.trim() || typeof document === 'undefined') {
    return ''
  }

  const template = document.createElement('template')
  template.innerHTML = html

  template.content
    .querySelectorAll('script, style, iframe, object, embed, form, input, button, textarea, select, link, meta')
    .forEach(element => element.remove())

  for (const element of Array.from(template.content.querySelectorAll('*'))) {
    const tagName = element.tagName.toLowerCase()

    if (!allowedDescriptionTags.has(tagName)) {
      element.replaceWith(...Array.from(element.childNodes))
      continue
    }

    for (const attribute of Array.from(element.attributes)) {
      const attributeName = attribute.name.toLowerCase()
      const isAllowedLinkAttribute = tagName === 'a' && ['href', 'title'].includes(attributeName)

      if (!isAllowedLinkAttribute) {
        element.removeAttribute(attribute.name)
      }
    }

    if (tagName === 'a') {
      const safeHref = normalizeSafeHref(element.getAttribute('href') ?? '')

      if (safeHref) {
        element.setAttribute('href', safeHref)
        element.setAttribute('target', '_blank')
        element.setAttribute('rel', 'noopener noreferrer')
      } else {
        element.removeAttribute('href')
      }
    }
  }

  return template.innerHTML
}
