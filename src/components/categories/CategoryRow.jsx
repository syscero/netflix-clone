import CategoryCard from './CategoryCard.jsx'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y } from 'swiper/modules'
import 'swiper/css'

export default function CategoryRow({ category }) {
  const { titulo, itens = [] } = category

  if (!itens.length) return null

  return (
    <article className="category-row">
      <div className="category-row__header">
        <h3>{titulo}</h3>
      </div>
      <Swiper
        className="category-row__swiper"
        modules={[A11y]}
        spaceBetween={14}
        breakpoints={{
          0: { slidesPerView: 2 },
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
      >
        {itens.map((item) => (
          <SwiperSlide key={`${titulo}-${item.titulo}-${item.img}`}>
            <CategoryCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </article>
  )
}
