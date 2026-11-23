import type { HttpContext } from '@adonisjs/core/http'
import { UNIT_SERVICE } from '../application/services/units_service.js'

export default class UnitsController {
  async index({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    return response.ok({ data: await UNIT_SERVICE.userUnits(user.id) })
  }

  async vocabulary({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    return response.ok({ data: await UNIT_SERVICE.userVocabulary(user.id) })
  }
}
