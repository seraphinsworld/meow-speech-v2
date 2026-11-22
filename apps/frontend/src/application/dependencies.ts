import type { AuthRepository } from '../domain/auth_repository'

let authRepository: AuthRepository | undefined

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
