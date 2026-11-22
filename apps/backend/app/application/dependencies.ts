import type { UnitRepository } from '../domain/units/unit_repository.js'

let unitRepository: UnitRepository | undefined

export function getUnitRepository(): UnitRepository {
  if (!unitRepository) {
    throw new Error('UnitRepository has not been configured')
  }

  return unitRepository
}

export function setUnitRepository(repository: UnitRepository): void {
  unitRepository = repository
}
