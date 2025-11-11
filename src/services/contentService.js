import { profileFileMap, DEFAULT_PROFILE } from '../data/profiles.js'

const PUBLIC_JSON_PATH = '/json'

const getFileForProfile = (profile) => {
  const fallback = profileFileMap[DEFAULT_PROFILE]
  if (!profile) return fallback
  return profileFileMap[profile] ?? fallback
}

export async function fetchContentByProfile(profile) {
  const fileName = getFileForProfile(profile)
  const response = await fetch(`${PUBLIC_JSON_PATH}/${fileName}.json`)

  if (!response.ok) {
    throw new Error(`Falha ao buscar dados (${response.status} - ${response.statusText})`)
  }

  return response.json()
}
