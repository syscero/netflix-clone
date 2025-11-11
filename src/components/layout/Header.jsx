import ProfileSelect from './ProfileSelect.jsx'

export default function Header({ profiles, activeProfile, onProfileChange }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <h1 className="logo">NETPHLIX</h1>
        <nav className="nav-links" aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#categorias">Categorias</a>
          <a href="#ajuda">Ajuda</a>
          <ProfileSelect
            options={profiles}
            value={activeProfile}
            onChange={onProfileChange}
          />
        </nav>
      </div>
    </header>
  )
}
