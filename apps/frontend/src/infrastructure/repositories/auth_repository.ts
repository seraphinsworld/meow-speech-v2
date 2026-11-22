import type { LoginCredentials, SignupDetails, User } from '../../domain/auth'
import { apiRequest } from '../http/api_client'
import { tokenStore } from '../http/token_store'

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<User> {
    const result = await apiRequest<{ data: { user: User; token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    tokenStore.set(result.data.token)
    return result.data.user
  },

  async signup(details: SignupDetails): Promise<User> {
    const result = await apiRequest<{ data: { user: User; token: string } }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(details),
    })
    tokenStore.set(result.data.token)
    return result.data.user
  },

  async profile(): Promise<User> {
    const result = await apiRequest<{ data: User }>('/account/profile')
    return result.data
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/account/logout', { method: 'POST' })
    } finally {
      tokenStore.clear()
    }
  },
}
