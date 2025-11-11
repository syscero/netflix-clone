export const normalizeAssetPath = (path = '') => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (path.startsWith('/')) return path
  if (path.startsWith('./')) return path.replace('./', '/')
  return `/${path}`
}

export const truncateText = (text = '', max = 200) => {
  if (!text) return ''
  if (text.length <= max) return text
  return `${text.substring(0, max - 1)}…`
}
