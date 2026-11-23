import { getUserSettingsRepository } from '../dependencies.js'
import type { UserSettings } from '../../domain/settings/user_settings.js'

export class UserSettingsService {
  get(userId: number) {
    return getUserSettingsRepository().get(userId)
  }

  save(userId: number, settings: UserSettings) {
    return getUserSettingsRepository().save(userId, settings)
  }
}

export const USER_SETTINGS_SERVICE = new UserSettingsService()
