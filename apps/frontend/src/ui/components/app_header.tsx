import { Link } from 'react-router'

type Props = {
  onLogout: () => void
  isLoggingOut: boolean
  backToUnits?: boolean
}

export function AppHeader({ onLogout, isLoggingOut, backToUnits = false }: Props) {
  return (
    <header className="topbar">
      {backToUnits ? (
        <Link className="text-button back-link" to="/">
          ← Retour aux unités
        </Link>
      ) : (
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            ✳
          </span>
          <span>meow speech</span>
        </Link>
      )}
      <button className="text-button" onClick={onLogout} disabled={isLoggingOut}>
        {isLoggingOut ? 'Déconnexion…' : 'Se déconnecter'}
      </button>
    </header>
  )
}
