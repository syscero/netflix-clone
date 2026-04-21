import HeroCard from './HeroCard.jsx'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, A11y } from 'swiper/modules'
import 'swiper/css'

export default function HeroCarousel({ items = [], profile }) {
  if (!items.length) return null

  return (
    <section id="inicio" aria-label="Destaques">
      <Swiper
        className="hero-carousel"
        modules={[Autoplay, A11y]}
        slidesPerView={1}
        loop={items.length > 1}
        autoplay={items.length > 1 ? { delay: 8000, disableOnInteraction: false } : false}
      >
        {items.map((item) => (
          <SwiperSlide key={`${item.titulo}-${item.img}`}>
            <HeroCard item={item} profile={profile} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
