const toneClassMap = {
  info: '',
  warning: 'state-message--warning',
  error: 'state-message--error',
}

export default function StateMessage({ message, tone = 'info' }) {
  const toneClass = toneClassMap[tone] ?? ''
  return <div className={`state-message ${toneClass}`.trim()}>{message}</div>
}
