import db from '@adonisjs/lucid/services/db'
import { unitDefinitions } from '../../domain/units/unit_definitions.js'
import { Unit } from '../../domain/units/unit.js'
import type { UnitRepository } from '../../domain/units/unit_repository.js'

type UnitProgressRow = {
  unit_id: number
  levels_completed: number
}

export class LucidUnitRepository implements UnitRepository {
  async userUnits(userId: number): Promise<Unit[]> {
    const progressRows = (await db
      .from('user_unit_progress')
      .select('unit_id', 'levels_completed')
      .where('user_id', userId)) as UnitProgressRow[]
    const levelsCompletedByUnitId = new Map(
      progressRows.map((progress) => [progress.unit_id, progress.levels_completed])
    )

    return unitDefinitions.map((definition, index) => {
      const previousDefinition = unitDefinitions[index - 1]
      const previousUnitCompleted = previousDefinition
        ? (levelsCompletedByUnitId.get(previousDefinition.id) ?? 0) >=
          previousDefinition.totalLevels
        : null

      return new Unit(
        definition,
        levelsCompletedByUnitId.get(definition.id) ?? 0,
        previousUnitCompleted
      )
    })
  }
}
