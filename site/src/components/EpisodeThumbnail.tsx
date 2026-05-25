import { thumbUrl } from '../utils/episode-format'

interface Props {
  image: string
  title: string
  url: string
}

export function EpisodeThumbnail({ image, title, url }: Props) {
  const thumb = thumbUrl(image)

  if (!thumb) {
    return null
  }

  const imageElement = (
    <img
      src={thumb}
      alt=""
      loading="lazy"
      width={64}
      height={64}
      className="w-16 h-16 rounded object-cover bg-white/5 hover:opacity-80 transition"
    />
  )

  if (!url) {
    return <div className="shrink-0">{imageElement}</div>
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0"
      title={`Abrir "${title}" no Jovem Nerd`}
    >
      {imageElement}
    </a>
  )
}
