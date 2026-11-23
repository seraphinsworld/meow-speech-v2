import { getLevelRepository } from '../dependencies.js'
import type { LevelResult } from '../../domain/units/level_repository.js'

/** Coordinates the level use cases without depending on the persistence adapter. */
export class LevelService {
  getLevel(userId: number, unitId: number, level: number) {
    return getLevelRepository().getLevel(userId, unitId, level)
  }

  complete(
    userId: number,
    unitId: number,
    level: number,
    sessionId: number,
    results: LevelResult[]
  ) {
    return getLevelRepository().complete(userId, unitId, level, sessionId, results)
  }
}

export const LEVEL_SERVICE = new LevelService()
