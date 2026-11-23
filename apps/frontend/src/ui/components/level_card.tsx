import { Link } from 'react-router'

type Props = { unitId: number; level: number; active: boolean; completed: boolean }

export function LevelCard({ unitId, level, active, completed }: Props) {
  const content = (
    <>
      <span className="level-number">{level}</span>
      <span>{active ? 'Disponible' : completed ? 'Terminé' : 'Verrouillé'}</span>
    </>
  )

  if (active || completed) {
    return (
      <Link
        className={`level-card ${active ? 'level-card--active' : 'level-card--completed'}`}
        to={`/units/${unitId}/levels/${level}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <button className="level-card" type="button" disabled>
      {content}
    </button>
  )
}
