const PODCAST_DETAIL_API = 'https://admin.jovemnerd.com.br/wp-json/wp/v2/podcast/'

interface WordpressPodcastPost {
  content?: {
    rendered?: string
  }
}

const contentCache = new Map<string, Promise<string>>()

export function fetchEpisodeFullDescription(slug: string): Promise<string> {
  const normalizedSlug = slug.trim()

  if (!normalizedSlug) {
    return Promise.resolve('')
  }

  const cached = contentCache.get(normalizedSlug)

  if (cached) {
    return cached
  }

  const request = fetch(`${PODCAST_DETAIL_API}?slug=${encodeURIComponent(normalizedSlug)}`)
    .then(async response => {
      if (!response.ok) {
        throw new Error(`Episode detail request failed with HTTP ${response.status}`)
      }

      const posts = await response.json() as WordpressPodcastPost[]
      const content = posts[0]?.content?.rendered

      return typeof content === 'string' ? content.trim() : ''
    })
    .catch(error => {
      contentCache.delete(normalizedSlug)
      throw error
    })

  contentCache.set(normalizedSlug, request)

  return request
}
