import type { User } from '../domain/auth'

type Props = { user: User; onLogout: () => void; isLoggingOut: boolean }

export function AccountScreen({ user, onLogout, isLoggingOut }: Props) {
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
    </main>
  )
}
