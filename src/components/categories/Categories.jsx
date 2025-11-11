import CategoryRow from './CategoryRow.jsx'

export default function Categories({ categories = [] }) {
  if (!categories.length) return null

  return (
    <section className="categories" id="categorias" aria-label="Listas personalizadas">
      {categories.map((category) => (
        <CategoryRow key={category.titulo} category={category} />
      ))}
    </section>
  )
}
