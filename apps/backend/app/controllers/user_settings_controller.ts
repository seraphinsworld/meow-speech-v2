import type { HttpContext } from '@adonisjs/core/http'
import { USER_SETTINGS_SERVICE } from '../application/services/user_settings_service.js'
import { isUserSettings } from '../domain/settings/user_settings.js'

export default class UserSettingsController {
  async show({ auth, response }: HttpContext) {
    const settings = await USER_SETTINGS_SERVICE.get(auth.getUserOrFail().id)
    return response.ok({ data: settings })
  }

  async update({ auth, request, response }: HttpContext) {
    const settings: unknown = request.body()
    if (!isUserSettings(settings)) {
      return response.unprocessableEntity({ message: 'Invalid user settings.' })
    }

    const savedSettings = await USER_SETTINGS_SERVICE.save(auth.getUserOrFail().id, settings)
    return response.ok({ data: savedSettings })
  }
}
