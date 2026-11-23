import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useUserSettings } from '../../application/use_user_settings.ts'
import { defaultUserSettings, type UserSettings } from '../../domain/models/user_settings.ts'
import { AppHeader } from '../components/app_header.tsx'

type Props = { onLogout: () => void; isLoggingOut: boolean }

export function SettingsScreen({ onLogout, isLoggingOut }: Props) {
  const { settings, isLoading, error, isSaving, saveError, save } = useUserSettings()
  const [draft, setDraft] = useState<UserSettings>(defaultUserSettings)
  const [saved, setSaved] = useState(false)

  useEffect(() => setDraft(settings), [settings])

  function update<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    setSaved(false)
    setDraft((current) => ({ ...current, [key]: value }))
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      await save(draft)
      setSaved(true)
    } catch {
      setSaved(false)
    }
  }

  return (
    <main className="account-layout">
      <AppHeader
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
        backTo={{ to: '/', label: 'Accueil' }}
      />
      <section className="settings-section">
        <span className="eyebrow">TON ESPACE</span>
        <h1>Paramètres</h1>
        <p className="muted">Personnalise le déroulement des questions et les sons.</p>

        {isLoading && (
          <p className="units-state" role="status">
            Chargement de tes paramètres…
          </p>
        )}
        {error && (
          <p className="units-state units-error" role="alert">
            Impossible de charger tes paramètres.
          </p>
        )}

        {!isLoading && !error && (
          <form className="settings-card" onSubmit={(event) => void saveSettings(event)}>
            <SettingsToggle
              title="Valider automatiquement"
              description="Une réponse est vérifiée dès que tu l’as complétée."
              checked={draft.autoValidate}
              onChange={(value) => update('autoValidate', value)}
            />
            <SettingsToggle
              title="Prononcer le mot automatiquement"
              description="Le mot est entendu à l’arrivée sur chaque nouvelle question."
              checked={draft.autoPlayPronunciation}
              onChange={(value) => update('autoPlayPronunciation', value)}
            />
            <SettingsToggle
              title="Effets sonores"
              description="Sons discrets lors des interactions et des bonnes réponses."
              checked={draft.soundEffectsEnabled}
              onChange={(value) => update('soundEffectsEnabled', value)}
            />
            <SettingsVolume
              title="Volume des effets"
              value={draft.soundEffectsVolume}
              disabled={!draft.soundEffectsEnabled}
              onChange={(value) => update('soundEffectsVolume', value)}
            />
            <SettingsVolume
              title="Volume de prononciation"
              value={draft.pronunciationVolume}
              onChange={(value) => update('pronunciationVolume', value)}
            />
            <div className="settings-actions">
              {saved && (
                <span className="settings-saved" role="status">
                  Paramètres enregistrés.
                </span>
              )}
              <button className="primary-button" type="submit" disabled={isSaving}>
                {isSaving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        )}
        {saveError && (
          <p className="settings-error" role="alert">
            Impossible d’enregistrer les paramètres.
          </p>
        )}
      </section>
    </main>
  )
}

type ToggleProps = {
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}

function SettingsToggle({ title, description, checked, onChange }: ToggleProps) {
  return (
    <label className="settings-toggle">
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  )
}

type VolumeProps = {
  title: string
  value: number
  disabled?: boolean
  onChange: (value: number) => void
}

function SettingsVolume({ title, value, disabled = false, onChange }: VolumeProps) {
  return (
    <label className={`settings-volume ${disabled ? 'settings-volume--disabled' : ''}`}>
      <span>
        <strong>{title}</strong>
        <output>{Math.round(value * 100)} %</output>
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(value * 100)}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value) / 100)}
      />
    </label>
  )
}
