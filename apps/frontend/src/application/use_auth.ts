import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { LoginCredentials, SignupDetails, User } from '../domain/auth'
import { authRepository } from '../infrastructure/repositories/auth_repository'
import { tokenStore } from '../infrastructure/http/token_store'

const profileKey = ['auth', 'profile']

export function useAuth() {
  const queryClient = useQueryClient()
  const hasToken = Boolean(tokenStore.get())

  const profile = useQuery({
    queryKey: profileKey,
    queryFn: async () => {
      try {
        return await authRepository.profile()
      } catch (error) {
        tokenStore.clear()
        throw error
      }
    },
    enabled: hasToken,
    retry: false,
  })

  const onAuthenticated = (user: User) => {
    queryClient.setQueryData(profileKey, user)
  }

  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) => authRepository.login(credentials),
    onSuccess: onAuthenticated,
  })

  const signup = useMutation({
    mutationFn: (details: SignupDetails) => authRepository.signup(details),
    onSuccess: onAuthenticated,
  })

  const logout = useMutation({
    mutationFn: authRepository.logout,
    onSettled: () => {
      tokenStore.clear()
      queryClient.setQueryData(profileKey, null)
    },
  })

  return {
    user: profile.data ?? null,
    isLoading: hasToken && profile.isPending,
    login,
    signup,
    logout,
  }
}
