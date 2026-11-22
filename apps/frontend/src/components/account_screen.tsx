import type { User } from '../domain/models/user.ts'
import { useUnits } from '../application/use_units'

type Props = { user: User; onLogout: () => void; isLoggingOut: boolean }

export function AccountScreen({ user, onLogout, isLoggingOut }: Props) {
  const { units, isLoading, error } = useUnits(user.id)

  return (
    <main className="account-layout">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            ✳
          </span>
          <span>meow speech</span>
        </a>
        <button className="text-button" onClick={onLogout} disabled={isLoggingOut}>
          {isLoggingOut ? 'Déconnexion…' : 'Se déconnecter'}
        </button>
      </header>
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

        {isLoading && <p className="units-state" role="status">Chargement des unités…</p>}

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
              <li className="unit-card" key={unit.name}>
                <div className="unit-card-heading">
                  <div>
                    <h3>{unit.label}</h3>
                    <p>{unit.name}</p>
                  </div>
                  <span className="unit-progress-label">
                    {unit.levelsCompleted} / {unit.levels}
                  </span>
                </div>
                <progress
                  className="unit-progress"
                  value={unit.levelsCompleted}
                  max={unit.levels || 1}
                  aria-label={`Progression ${unit.label}`}
                />
                <ul className="phoneme-list" aria-label={`Phonèmes ${unit.label}`}>
                  {unit.phonemes.map((phoneme, index) => (
                    <li key={`${phoneme}-${index}`}>{phoneme}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
