import type { LoginCredentials, SignupDetails, User } from '../../domain/models/user'
import type { AuthRepository } from '../../domain/repositories/auth_repository'
import { ApiError, apiRequest } from '../http/api_client'
import { tokenStore } from '../http/token_store'

export class HttpAuthRepository implements AuthRepository {
  async hasSession(): Promise<boolean> {
    return Boolean(await tokenStore.get())
  }

  async login(credentials: LoginCredentials): Promise<User> {
    const result = await apiRequest<{ data: { user: User; token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    await tokenStore.set(result.data.token)
    return result.data.user
  }

  async signup(details: SignupDetails): Promise<User> {
    const result = await apiRequest<{ data: { user: User; token: string } }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(details),
    })
    await tokenStore.set(result.data.token)
    return result.data.user
  }

  async profile(): Promise<User> {
    try {
      const result = await apiRequest<{ data: User }>('/account/profile')
      return result.data
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) await tokenStore.clear()
      throw error
    }
  }

  async logout(): Promise<void> {
    await apiRequest('/account/logout', { method: 'POST' })
    await tokenStore.clear()
  }
}
