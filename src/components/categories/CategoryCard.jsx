import { normalizeAssetPath } from '../../utils/contentUtils.js'

export default function CategoryCard({ item }) {
  const { titulo, img, url, urlTarget } = item
  const imageSrc = normalizeAssetPath(img)

  const content = (
    <div className="category-card">
      <img src={imageSrc} alt={titulo} loading="lazy" />
    </div>
  )

  if (!url) {
    return content
  }

  return (
    <a
      className="category-card__link"
      href={url}
      target={urlTarget || '_blank'}
      rel="noopener noreferrer"
      aria-label={`Abrir detalhes de ${titulo}`}
    >
      {content}
    </a>
  )
}
