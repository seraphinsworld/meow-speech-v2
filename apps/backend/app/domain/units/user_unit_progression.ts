import { unitDefinitions } from './unit_definitions.js'
import { Unit, type UnitDefinition } from './unit.js'

export function createUserUnitProgression(
  definition: UnitDefinition,
  completedLevels: ReadonlyMap<number, number>
): Unit {
  const previousUnit = unitDefinitions.find((unit) => unit.id === definition.id - 1)
  const previousUnitHasCompletedLevel = previousUnit
    ? (completedLevels.get(previousUnit.id) ?? 0) >= 1
    : null

  return new Unit(
    definition,
    completedLevels.get(definition.id) ?? 0,
    previousUnitHasCompletedLevel
  )
}
