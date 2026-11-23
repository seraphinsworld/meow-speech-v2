import type { UserSettings } from '../models/user_settings.ts'

export interface UserSettingsRepository {
  get(): Promise<UserSettings>
  save(settings: UserSettings): Promise<UserSettings>
}
