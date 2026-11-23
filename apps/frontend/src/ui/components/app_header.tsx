import { Link } from 'react-router'

type Props = {
  onLogout: () => void
  isLoggingOut: boolean
  backTo?: { to: string; label: string }
}

export function AppHeader({ onLogout, isLoggingOut, backTo }: Props) {
  return (
    <header className="topbar">
      {backTo ? (
        <Link className="text-button back-link" to={backTo.to}>
          ← {backTo.label}
        </Link>
      ) : (
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            ✳
          </span>
          <span>meow speech</span>
        </Link>
      )}
      <nav className="topbar-actions" aria-label="Navigation du compte">
        <Link className="text-button" to="/settings">
          Paramètres
        </Link>
        <button className="text-button" onClick={onLogout} disabled={isLoggingOut}>
          {isLoggingOut ? 'Déconnexion…' : 'Se déconnecter'}
        </button>
      </nav>
    </header>
  )
}
