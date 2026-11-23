import type { AuthRepository } from '../domain/repositories/auth_repository.ts'
import type { UnitRepository } from '../domain/repositories/unit_repository.ts'
import type { LevelRepository } from '../domain/repositories/level_repository.ts'
import type { UserSettingsRepository } from '../domain/repositories/user_settings_repository.ts'

let authRepository: AuthRepository | undefined
let unitRepository: UnitRepository | undefined
let levelRepository: LevelRepository | undefined
let userSettingsRepository: UserSettingsRepository | undefined

export function getAuthRepository(): AuthRepository {
  if (!authRepository) {
    throw new Error('AuthRepository has not been configured')
  }

  return authRepository
}

export function setAuthRepository(repository: AuthRepository): void {
  authRepository = repository
}

export function resetAuthRepository(): void {
  authRepository = undefined
}

export function getUnitRepository(): UnitRepository {
  if (!unitRepository) {
    throw new Error('UnitRepository has not been configured')
  }

  return unitRepository
}

export function setUnitRepository(repository: UnitRepository): void {
  unitRepository = repository
}

export function resetUnitRepository(): void {
  unitRepository = undefined
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

export function resetLevelRepository(): void {
  levelRepository = undefined
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

export function resetUserSettingsRepository(): void {
  userSettingsRepository = undefined
}
