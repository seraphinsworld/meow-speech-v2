import { Link } from 'react-router'
import { isUnitActive, type Unit } from '../../domain/models/units.ts'

export function UnitCard({ unit }: { unit: Unit }) {
  const active = isUnitActive(unit)

  return (
    <li className={`unit-card ${active ? '' : 'unit-card--inactive'}`}>
      {active ? (
        <Link className="unit-card-open" to={`/units/${unit.id}`}>
          <UnitCardLabel unit={unit} active />
        </Link>
      ) : (
        <button className="unit-card-open" type="button" disabled>
          <UnitCardLabel unit={unit} active={false} />
        </button>
      )}
      <span className="unit-progress-label">
        {unit.levelsCompleted} / {unit.totalLevels} niveaux terminés
      </span>
      <progress
        className="unit-progress"
        value={unit.levelsCompleted}
        max={unit.totalLevels || 1}
        aria-label={`Progression ${unit.title}`}
      />
      <ul className="phoneme-list" aria-label={`Phonèmes ${unit.title}`}>
        {unit.activePhonemes.map((phoneme, index) => (
          <li key={`${phoneme}-${index}`}>{phoneme}</li>
        ))}
      </ul>
    </li>
  )
}

function UnitCardLabel({ unit, active }: { unit: Unit; active: boolean }) {
  return (
    <>
      <span className="unit-card-heading">
        <span>
          <span className="unit-card-title">{unit.title}</span>
          <span className="unit-card-slug">{unit.slug}</span>
        </span>
        <span className={`unit-status ${active ? 'unit-status--active' : ''}`}>
          {active ? 'Active' : 'Verrouillée'}
        </span>
      </span>
      <span className="unit-open-hint">
        {active ? 'Voir les niveaux →' : 'Termine les niveaux précédents'}
      </span>
    </>
  )
}
