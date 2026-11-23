import { unitDefinitions } from './unit_definitions.js'
import { Unit, type UnitDefinition } from './unit.js'

export function createUserUnitProgression(
  definition: UnitDefinition,
  completedLevels: ReadonlyMap<number, number>
): Unit {
  const previousUnit = unitDefinitions.find((unit) => unit.id === definition.id - 1)
  const previousUnitCompleted = previousUnit
    ? (completedLevels.get(previousUnit.id) ?? 0) >= previousUnit.totalLevels
    : null

  return new Unit(definition, completedLevels.get(definition.id) ?? 0, previousUnitCompleted)
}
