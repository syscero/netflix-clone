import HeroCard from './HeroCard.jsx'

export default function HeroCarousel({ items = [], profile }) {
  if (!items.length) return null

  return (
    <section className="hero-carousel" id="inicio" aria-label="Destaques">
      {items.map((item) => (
        <HeroCard key={`${item.titulo}-${item.img}`} item={item} profile={profile} />
      ))}
    </section>
  )
}
