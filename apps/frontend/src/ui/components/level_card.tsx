type Props = { level: number; active: boolean }

export function LevelCard({ level, active }: Props) {
  return (
    <button
      className={`level-card ${active ? 'level-card--active' : ''}`}
      type="button"
      disabled={!active}
    >
      <span className="level-number">{level}</span>
      <span>{active ? 'Disponible' : 'Verrouillé'}</span>
    </button>
  )
}
