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
