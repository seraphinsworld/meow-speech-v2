import { AccountScreen } from '../components/account_screen'
import { AuthScreen } from '../components/auth_screen'
import { useAuth } from '../application/use_auth'

export function App() {
  const auth = useAuth()

  if (auth.isLoading) {
    return (
      <div className="loading-screen">
        <span className="brand-mark" aria-label="Chargement">
          ✳
        </span>
      </div>
    )
  }

  if (auth.user) {
    return (
      <AccountScreen
        user={auth.user}
        onLogout={() => void auth.logout.mutateAsync().catch(() => undefined)}
        isLoggingOut={auth.logout.isPending}
      />
    )
  }

  const currentError = auth.login.error ?? auth.signup.error

  return (
    <AuthScreen
      onLogin={(credentials) => auth.login.mutateAsync(credentials)}
      onSignup={(details) => auth.signup.mutateAsync(details)}
      isBusy={auth.login.isPending || auth.signup.isPending}
      error={currentError instanceof Error ? currentError.message : null}
    />
  )
}
