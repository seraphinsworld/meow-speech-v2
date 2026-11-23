import type { HttpContext } from '@adonisjs/core/http'
import { LEVEL_SERVICE } from '../application/services/level_service.js'
import {
  ActiveLevelSessionError,
  InvalidLevelSubmissionError,
  LevelNotFoundError,
} from '../domain/units/level_repository.js'

export default class LevelsController {
  async show({ auth, params, response }: HttpContext) {
    try {
      const data = await LEVEL_SERVICE.getLevel(
        auth.getUserOrFail().id,
        Number(params.unitId),
        Number(params.level)
      )
      return response.ok({ data })
    } catch (error) {
      if (error instanceof ActiveLevelSessionError) {
        return response.conflict({
          message: `Continue level ${error.activeLevel} to finish the active session.`,
        })
      }
      if (error instanceof LevelNotFoundError)
        return response.notFound({ message: 'Level not found.' })
      throw error
    }
  }

  async complete({ auth, params, request, response }: HttpContext) {
    const body = request.body() as {
      sessionId?: number
      results?: Array<{ questionId: string; word: string; correct: boolean }>
    }
    try {
      const data = await LEVEL_SERVICE.complete(
        auth.getUserOrFail().id,
        Number(params.unitId),
        Number(params.level),
        Number(body.sessionId),
        Array.isArray(body.results) ? body.results : []
      )
      return response.ok({ data })
    } catch (error) {
      if (error instanceof InvalidLevelSubmissionError)
        return response.unprocessableEntity({
          message: 'The submitted results do not match the active level.',
        })
      if (error instanceof LevelNotFoundError)
        return response.notFound({ message: 'Level not found.' })
      throw error
    }
  }
}
