import type { UnitRepository } from '../domain/units/unit_repository.js'
import type { LevelRepository } from '../domain/units/level_repository.js'
import type { UserSettingsRepository } from '../domain/settings/user_settings_repository.js'

let unitRepository: UnitRepository | undefined
let levelRepository: LevelRepository | undefined
let userSettingsRepository: UserSettingsRepository | undefined

export function getUnitRepository(): UnitRepository {
  if (!unitRepository) {
    throw new Error('UnitRepository has not been configured')
  }

  return unitRepository
}

export function setUnitRepository(repository: UnitRepository): void {
  unitRepository = repository
}

export function getLevelRepository(): LevelRepository {
  if (!levelRepository) {
    throw new Error('LevelRepository has not been configured')
  }
  return levelRepository
}

export function setLevelRepository(repository: LevelRepository): void {
  levelRepository = repository
}

export function getUserSettingsRepository(): UserSettingsRepository {
  if (!userSettingsRepository) {
    throw new Error('UserSettingsRepository has not been configured')
  }
  return userSettingsRepository
}

export function setUserSettingsRepository(repository: UserSettingsRepository): void {
  userSettingsRepository = repository
}
