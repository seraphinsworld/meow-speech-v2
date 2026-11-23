import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AuthRepository } from '../src/domain/repositories/auth_repository.ts'
import type { UnitRepository } from '../src/domain/repositories/unit_repository.ts'
import type { User } from '../src/domain/models/user.ts'
import {
  resetAuthRepository,
  resetUnitRepository,
  setAuthRepository,
  setUnitRepository,
} from '../src/application/dependencies'
import { App } from '../src/ui/app'

afterEach(() => {
  cleanup()
  resetAuthRepository()
  resetUnitRepository()
})

describe('App authentication', () => {
  it('shows the authenticated user name after login', async () => {
    const user: User = {
      id: 1,
      fullName: 'Séraphin Vandegar',
      email: 'seraphin@example.com',
      initials: 'SV',
    }
    let hasSession = false
    const authRepository: AuthRepository = {
      hasSession: async () => hasSession,
      login: vi.fn(async () => {
        hasSession = true
        return user
      }),
      signup: vi.fn(async () => user),
      profile: vi.fn(async () => user),
      logout: vi.fn(async () => {
        hasSession = false
      }),
    }
    setAuthRepository(authRepository)
    const unitRepository: UnitRepository = { list: vi.fn(async () => []) }
    setUnitRepository(unitRepository)

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    const userInteraction = userEvent.setup()

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )

    expect(authRepository.profile).not.toHaveBeenCalled()
    await userInteraction.type(screen.getByLabelText('Adresse e-mail'), user.email)
    await userInteraction.type(screen.getByLabelText('Mot de passe'), 'a-secure-password')
    await userInteraction.click(screen.getByRole('button', { name: /me connecter/i }))

    const greeting = await screen.findByRole('heading', {
      name: `Bonjour, ${user.fullName} !`,
    })
    expect(greeting).toBeTruthy()
    expect(authRepository.login).toHaveBeenCalledWith({
      email: user.email,
      password: 'a-secure-password',
    })
  })
})
