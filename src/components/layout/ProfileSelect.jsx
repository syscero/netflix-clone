export default function ProfileSelect({ options = [], value, onChange }) {
  return (
    <label className="profile-select">
      <span>Perfil</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
