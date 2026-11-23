import type { UserSettings } from '../../domain/models/user_settings.ts'
import type { UserSettingsRepository } from '../../domain/repositories/user_settings_repository.ts'
import { apiRequest } from '../http/api_client.ts'

export class HttpUserSettingsRepository implements UserSettingsRepository {
  async get(): Promise<UserSettings> {
    const response = await apiRequest<{ data: UserSettings }>('/account/settings')
    return response.data
  }

  async save(settings: UserSettings): Promise<UserSettings> {
    const response = await apiRequest<{ data: UserSettings }>('/account/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
    return response.data
  }
}
