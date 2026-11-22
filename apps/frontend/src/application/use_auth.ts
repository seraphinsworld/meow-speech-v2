import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { LoginCredentials, SignupDetails, User } from '../domain/auth'
import { AUTH_REPOSITORY } from '../domain/repositories.ts'

const profileKey = ['auth', 'profile']

export function useAuth() {
  const authRepository = AUTH_REPOSITORY
  const queryClient = useQueryClient()
  const hasSession = authRepository.hasSession()

  const profile = useQuery({ queryKey: profileKey, queryFn: () => authRepository.profile() })

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
      queryClient.setQueryData(profileKey, null)
    },
  })

  return {
    user: profile.data ?? null,
    isLoading: hasSession && profile.isPending,
    login,
    signup,
    logout,
  }
}
