import { useEffect, useState } from 'react'
import { fetchContentByProfile } from '../services/contentService.js'
import { fallbackContent } from '../data/fallbackContent.js'

export function useContentData(profile) {
  const [data, setData] = useState(fallbackContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true
    setLoading(true)
    setError(null)

    fetchContentByProfile(profile)
      .then((result) => {
        if (!isActive) return
        setData(result)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Erro ao carregar conteúdo', err)
        if (!isActive) return
        setData(fallbackContent)
        setError(err)
        setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [profile])

  return { data, loading, error }
}
