export type UserSettings = {
  autoValidate: boolean
  autoPlayPronunciation: boolean
  soundEffectsEnabled: boolean
  soundEffectsVolume: number
  pronunciationVolume: number
}

export const defaultUserSettings: UserSettings = {
  autoValidate: true,
  autoPlayPronunciation: false,
  soundEffectsEnabled: true,
  soundEffectsVolume: 0.35,
  pronunciationVolume: 0.8,
}

export function isUserSettings(value: unknown): value is UserSettings {
  if (typeof value !== 'object' || value === null) return false
  const settings = value as Record<string, unknown>
  return (
    typeof settings.autoValidate === 'boolean' &&
    typeof settings.autoPlayPronunciation === 'boolean' &&
    typeof settings.soundEffectsEnabled === 'boolean' &&
    isVolume(settings.soundEffectsVolume) &&
    isVolume(settings.pronunciationVolume)
  )
}

function isVolume(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
}
