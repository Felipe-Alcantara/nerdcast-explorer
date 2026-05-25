import type { EpisodeGuest } from '../types'
import { guestUrl } from '../utils/episode-format'

interface Props {
  guests: EpisodeGuest[]
}

export function EpisodeGuests({ guests }: Props) {
  if (guests.length === 0) {
    return null
  }

  return (
    <p className="text-xs text-slate-500 truncate">
      com{' '}
      {guests.map((guest, index) => {
        const url = guestUrl(guest.twitter)

        return (
          <span key={guest.id ?? guest.name}>
            {index > 0 && ', '}
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-300 hover:underline underline-offset-2 transition"
                title={`Abrir Twitter de ${guest.name}`}
              >
                {guest.name}
              </a>
            ) : (
              guest.name
            )}
          </span>
        )
      })}
    </p>
  )
}
