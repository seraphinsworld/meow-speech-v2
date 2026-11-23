import { Navigate, useParams } from 'react-router'
import { isLevelActive, isLevelCompleted, isUnitActive } from '../../domain/models/units.ts'
import { useUnits } from '../../application/use_units.ts'
import { AppHeader } from '../components/app_header.tsx'
import { LevelCard } from '../components/level_card.tsx'

type Props = { onLogout: () => void; isLoggingOut: boolean }

export function UnitLevelsScreen({ onLogout, isLoggingOut }: Props) {
  const { unitId } = useParams<{ unitId: string }>()
  const { units, isLoading, error } = useUnits()
  const parsedUnitId = Number(unitId)
  const unit = units.find((candidate) => candidate.id === parsedUnitId)

  if (isLoading) {
    return (
      <main className="account-layout">
        <AppHeader
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
          backTo={{ to: '/', label: 'Retour aux unités' }}
        />
        <section className="levels-section">
          <p className="units-state" role="status">
            Chargement des niveaux…
          </p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="account-layout">
        <AppHeader
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
          backTo={{ to: '/', label: 'Retour aux unités' }}
        />
        <section className="levels-section">
          <p className="units-state units-error" role="alert">
            {error instanceof Error ? error.message : 'Impossible de charger les niveaux.'}
          </p>
        </section>
      </main>
    )
  }

  if (!unit || !isUnitActive(unit)) {
    return <Navigate to="/" replace />
  }

  const levels = Array.from({ length: unit.totalLevels }, (_, index) => index + 1)

  return (
    <main className="account-layout">
      <AppHeader
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
        backTo={{ to: '/', label: 'Retour aux unités' }}
      />

      <section className="levels-section" aria-labelledby="unit-levels-heading">
        <span className="eyebrow">TON PARCOURS · {unit.slug.toUpperCase()}</span>
        <h1 id="unit-levels-heading">{unit.title}</h1>
        <p className="muted">
          {unit.levelsCompleted} niveau{unit.levelsCompleted === 1 ? '' : 'x'} terminé
          {unit.levelsCompleted === 1 ? '' : 's'} sur {unit.totalLevels}
        </p>

        <ul className="level-list" aria-label={`Niveaux de ${unit.title}`}>
          {levels.map((level) => {
            const active = isLevelActive(unit, level)
            const completed = isLevelCompleted(unit, level)

            return (
              <li key={level}>
                <LevelCard unitId={unit.id} level={level} active={active} completed={completed} />
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
