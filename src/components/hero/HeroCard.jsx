import { normalizeAssetPath, truncateText } from '../../utils/contentUtils.js'

const openInNewTab = (url, target = '_blank') => {
  if (!url) return
  window.open(url, target, 'noopener')
}

export default function HeroCard({ item, profile }) {
  const {
    titulo,
    descricao,
    img,
    url,
    urlTarget,
    ocultarBtnAssistir,
  } = item

  const backgroundImage = normalizeAssetPath(img)
  const isBookProfile = profile === 'books'

  const style = {
    backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.1)), url('${backgroundImage}')`,
    backgroundSize: isBookProfile ? 'contain' : 'cover',
    backgroundRepeat: isBookProfile ? 'no-repeat' : 'no-repeat',
    backgroundPosition: isBookProfile ? 'right center' : 'center',
  }

  return (
    <article className="hero-card" style={style}>
      <div className="hero-card__content">
        <h2 className="hero-card__title">{titulo}</h2>
        <p className="hero-card__description">{truncateText(descricao, 240)}</p>
        <div className="hero-card__actions">
          {!ocultarBtnAssistir && (
            <button type="button" className="net-button net-button--primary">
              Assistir agora
            </button>
          )}
          <button
            type="button"
            className="net-button net-button--ghost"
            onClick={() => openInNewTab(url, urlTarget)}
            disabled={!url}
          >
            Mais informações
          </button>
        </div>
      </div>
    </article>
  )
}
