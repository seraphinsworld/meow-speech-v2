import { Link } from 'react-router'

type Props = { unitId: number; level: number; active: boolean }

export function LevelCard({ unitId, level, active }: Props) {
  const content = (
    <>
      <span className="level-number">{level}</span>
      <span>{active ? 'Disponible' : 'Verrouillé'}</span>
    </>
  )

  if (active) {
    return (
      <Link className="level-card level-card--active" to={`/units/${unitId}/levels/${level}`}>
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
