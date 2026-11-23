import { AccountScreen } from './screens/account_screen.tsx'
import { AuthScreen } from './screens/auth_screen.tsx'
import { UnitLevelsScreen } from './screens/unit_levels_screen.tsx'
import { LevelQuestionnaireScreen } from './screens/level_questionnaire_screen.tsx'
import { SettingsScreen } from './screens/settings_screen.tsx'
import { VocabularyScreen } from './screens/vocabulary_screen.tsx'
import { useAuth } from '../application/use_auth'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

function AppContent() {
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
      <Routes>
        <Route
          path="/"
          element={
            <AccountScreen
              user={auth.user}
              onLogout={() => void auth.logout.mutateAsync().catch(() => undefined)}
              isLoggingOut={auth.logout.isPending}
            />
          }
        />
        <Route
          path="/units/:unitId"
          element={
            <UnitLevelsScreen
              onLogout={() => void auth.logout.mutateAsync().catch(() => undefined)}
              isLoggingOut={auth.logout.isPending}
            />
          }
        />
        <Route
          path="/units/:unitId/levels/:levelNumber"
          element={
            <LevelQuestionnaireScreen
              onLogout={() => void auth.logout.mutateAsync().catch(() => undefined)}
              isLoggingOut={auth.logout.isPending}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <SettingsScreen
              onLogout={() => void auth.logout.mutateAsync().catch(() => undefined)}
              isLoggingOut={auth.logout.isPending}
            />
          }
        />
        <Route
          path="/vocabulary"
          element={
            <VocabularyScreen
              user={auth.user}
              onLogout={() => void auth.logout.mutateAsync().catch(() => undefined)}
              isLoggingOut={auth.logout.isPending}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
