export interface Program {
  slug: string
  name: string
  count?: number
}

export interface Theme {
  slug: string
  name: string
}

export interface Guest {
  id: number | null
  name: string
  twitter: string
  photo: string
}

export type EpisodeGuest = Guest

export interface Episode {
  id: string
  wp_id: number
  slug: string
  url: string
  title: string
  description: string
  date: string
  year: number | null
  month: number | null
  episode_number: number | null
  duration_seconds: number | null
  program: Program
  theme: string | null
  image: string
  audio: {
    high: string
    medium: string
    low: string
    zip: string
  }
  guests: EpisodeGuest[]
}
