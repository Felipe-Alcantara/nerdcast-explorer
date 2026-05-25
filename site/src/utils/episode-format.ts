const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function formatEpisodeDate(date: string): string {
  if (!date) return ''

  const [year, month, day] = date.split('-')
  const monthIndex = Number.parseInt(month, 10) - 1
  const monthLabel = MONTHS[monthIndex]

  if (!year || !day || !monthLabel) {
    return ''
  }

  return `${day} ${monthLabel} ${year}`
}

export function formatDuration(seconds: number | null): string {
  if (!seconds) return ''

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)

  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`
}

export function guestUrl(twitter: string): string {
  if (!twitter) return ''
  if (/^https?:\/\//i.test(twitter)) return twitter

  return `https://twitter.com/${twitter.replace(/^@/, '')}`
}

export function thumbUrl(image: string): string {
  if (!image) return ''
  if (/-\d+x\d+\.(jpg|jpeg|png|webp)/i.test(image)) return image

  return image.includes('?') ? image : `${image}?ims=180x180/filters:quality(75)`
}
