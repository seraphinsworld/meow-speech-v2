import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { LoginCredentials, SignupDetails, User } from '../domain/models/user.ts'
import { getAuthRepository } from './dependencies'

const profileKey = ['auth', 'profile']

export function useAuth() {
  const authRepository = getAuthRepository()
  const queryClient = useQueryClient()
  const profile = useQuery({
    queryKey: profileKey,
    queryFn: async () => {
      if (!(await authRepository.hasSession())) return null
      return authRepository.profile()
    },
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
    onSuccess: () => {
      queryClient.setQueryData(profileKey, null)
    },
  })

  return {
    user: profile.data ?? null,
    isLoading: profile.isPending,
    login,
    signup,
    logout,
  }
}
