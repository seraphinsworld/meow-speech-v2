import type { UserSettings } from './user_settings.js'

export interface UserSettingsRepository {
  get(userId: number): Promise<UserSettings>
  save(userId: number, settings: UserSettings): Promise<UserSettings>
}
