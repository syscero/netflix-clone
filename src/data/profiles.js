export const profiles = [
  {
    value: 'normal',
    label: 'Sou Normal',
    dataFile: 'dados',
    queryParam: null,
  },
  {
    value: 'flat',
    label: 'Sou Terraplanista',
    dataFile: 'piadas',
    queryParam: 'handicapped',
  },
  {
    value: 'books',
    label: 'Prefiro Livros',
    dataFile: 'livros',
    queryParam: 'hero',
  },
]

export const DEFAULT_PROFILE = profiles[0].value

export const profileFileMap = profiles.reduce((acc, profile) => {
  acc[profile.value] = profile.dataFile
  return acc
}, {})

export function getInitialProfile(search) {
  const safeSearch =
    typeof search === 'string'
      ? search
      : typeof window !== 'undefined'
        ? window.location.search
        : ''

  const params = new URLSearchParams(safeSearch)
  const match = profiles.find((profile) => profile.queryParam && params.has(profile.queryParam))
  return match?.value ?? DEFAULT_PROFILE
}
