import type { AuthRepository } from '../domain/repositories/auth_repository.ts'
import type { UnitRepository } from '../domain/repositories/unit_repository.ts'

let authRepository: AuthRepository | undefined
let unitRepository: UnitRepository | undefined

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
