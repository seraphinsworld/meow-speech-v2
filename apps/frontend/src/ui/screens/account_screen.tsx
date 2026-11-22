import type { User } from '../../domain/models/user.ts'
import { useUnits } from '../../application/use_units.ts'
import { AppHeader } from '../components/app_header.tsx'
import { UnitCard } from '../components/unit_card.tsx'

type Props = { user: User; onLogout: () => void; isLoggingOut: boolean }

export function AccountScreen({ user, onLogout, isLoggingOut }: Props) {
  const { units, isLoading, error } = useUnits()

  return (
    <main className="account-layout">
      <AppHeader onLogout={onLogout} isLoggingOut={isLoggingOut} />
      <section className="account-card">
        <div className="avatar" aria-hidden="true">
          {user.initials || 'M'}
        </div>
        <span className="eyebrow">ESPACE PERSONNEL</span>
        <h1>Bonjour{user.fullName ? `, ${user.fullName}` : ''} !</h1>
        <p className="muted">{user.email}</p>
        <div className="starter-note">
          <span aria-hidden="true">✳</span>
          <p>
            La base de Meow Speech V2 est prête. Tu peux construire les fonctionnalités ici, une
            étape à la fois.
          </p>
        </div>
      </section>

      <section className="units-section" aria-labelledby="units-heading">
        <div className="units-section-heading">
          <div>
            <span className="eyebrow">TON PARCOURS</span>
            <h2 id="units-heading">Unités</h2>
          </div>
          {!isLoading && !error && <span className="units-count">{units.length}</span>}
        </div>

        {isLoading && (
          <p className="units-state" role="status">
            Chargement des unités…
          </p>
        )}

        {error && (
          <div className="units-state units-error" role="alert">
            <p>{error instanceof Error ? error.message : 'Impossible de charger les unités.'}</p>
          </div>
        )}

        {!isLoading && !error && units.length === 0 && (
          <p className="units-state">Aucune unité disponible pour le moment.</p>
        )}

        {units.length > 0 && (
          <ul className="unit-list">
            {units.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
