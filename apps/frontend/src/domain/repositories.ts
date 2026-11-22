import type { AuthRepository } from './auth_repository.ts'
import { HttpAuthRepository } from '../infrastructure/repositories/auth_repository.ts'

export let AUTH_REPOSITORY: AuthRepository = new HttpAuthRepository()
