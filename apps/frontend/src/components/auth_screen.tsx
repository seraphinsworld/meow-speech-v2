import { useState, type FormEvent } from 'react'
import type { LoginCredentials, SignupDetails } from '../domain/auth'

type Props = {
  onLogin: (credentials: LoginCredentials) => Promise<unknown>
  onSignup: (details: SignupDetails) => Promise<unknown>
  isBusy: boolean
  error: string | null
}

export function AuthScreen({ onLogin, onSignup, isBusy, error }: Props) {
  const [registering, setRegistering] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      if (registering) {
        await onSignup({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          passwordConfirmation,
        })
      } else {
        await onLogin({ email: email.trim(), password })
      }
    } catch {
      // The mutation error is surfaced by the parent and rendered below.
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-story" aria-label="Présentation de Meow Speech">
        <a className="brand" href="/" aria-label="Meow Speech, accueil">
          <span className="brand-mark" aria-hidden="true">
            ✳
          </span>
          <span>meow speech</span>
        </a>
        <div className="story-copy">
          <span className="eyebrow">TON PARCOURS, À TON RYTHME</span>
          <h1>
            Prends confiance.
            <br />
            <em>Un son à la fois.</em>
          </h1>
          <p>Connecte-toi pour retrouver ton espace d’apprentissage.</p>
        </div>
        <div className="story-decoration" aria-hidden="true">
          <span>m</span>
          <span>əʊ</span>
          <span>✳</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <span className="eyebrow">{registering ? 'BIENVENUE' : 'HEUREUX DE TE REVOIR'}</span>
          <h2>{registering ? 'Créer mon compte' : 'Me connecter'}</h2>
          <p className="muted">
            {registering
              ? 'Quelques informations pour commencer.'
              : 'Connecte-toi pour accéder à ton espace.'}
          </p>

          <form onSubmit={(event) => void submit(event)}>
            {registering && (
              <label>
                Nom complet
                <input
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </label>
            )}
            <label>
              Adresse e-mail
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Mot de passe
              <input
                type="password"
                autoComplete={registering ? 'new-password' : 'current-password'}
                minLength={registering ? 8 : undefined}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {registering && (
              <label>
                Confirmer le mot de passe
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={passwordConfirmation}
                  onChange={(event) => setPasswordConfirmation(event.target.value)}
                  required
                />
              </label>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="primary-button full-width" disabled={isBusy}>
              {isBusy ? 'Un instant…' : registering ? 'Créer mon compte' : 'Me connecter'}
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          <p className="switch-auth">
            {registering ? 'Tu as déjà un compte ?' : 'Pas encore de compte ?'}{' '}
            <button
              type="button"
              onClick={() => setRegistering((value) => !value)}
              disabled={isBusy}
            >
              {registering ? 'Me connecter' : 'Créer un compte'}
            </button>
          </p>
        </div>
        <span className="panel-footer">Meow Speech · Nouvelle base de l’application</span>
      </section>
    </main>
  )
}
