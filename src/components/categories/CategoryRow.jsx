import CategoryCard from './CategoryCard.jsx'

export default function CategoryRow({ category }) {
  const { titulo, itens = [] } = category

  if (!itens.length) return null

  return (
    <article className="category-row">
      <div className="category-row__header">
        <h3>{titulo}</h3>
      </div>
      <div className="category-row__scroller">
        {itens.map((item) => (
          <CategoryCard key={`${titulo}-${item.titulo}-${item.img}`} item={item} />
        ))}
      </div>
    </article>
  )
}
