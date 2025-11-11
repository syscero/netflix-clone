import { useState } from 'react'
import Header from '../../components/layout/Header.jsx'
import HeroCarousel from '../../components/hero/HeroCarousel.jsx'
import Categories from '../../components/categories/Categories.jsx'
import StateMessage from '../../components/common/StateMessage.jsx'
import { profiles, getInitialProfile } from '../../data/profiles.js'
import { useContentData } from '../../hooks/useContentData.js'

export default function Home() {
  const [selectedProfile, setSelectedProfile] = useState(() => getInitialProfile())
  const { data, loading, error } = useContentData(selectedProfile)

  return (
    <div className="app-shell">
      <Header
        profiles={profiles}
        activeProfile={selectedProfile}
        onProfileChange={setSelectedProfile}
      />
      <main className="app-main">
        {loading && <StateMessage message="Carregando catálogo..." tone="info" />}
        {!loading && error && (
          <StateMessage
            message="Não foi possível carregar os dados originais. Veja nossas sugestões alternativas!"
            tone="warning"
          />
        )}
        {!loading && (
          <>
            <HeroCarousel items={data?.principal ?? []} profile={selectedProfile} />
            <Categories categories={data?.categorias ?? []} />
          </>
        )}
      </main>
    </div>
  )
}
