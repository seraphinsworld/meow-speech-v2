import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserSettingsRepository } from './dependencies.ts'
import { defaultUserSettings, type UserSettings } from '../domain/models/user_settings.ts'

export const userSettingsQueryKey = ['user-settings'] as const

export function useUserSettings() {
  const repository = getUserSettingsRepository()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: userSettingsQueryKey,
    queryFn: () => repository.get(),
  })
  const saveMutation = useMutation({
    mutationFn: (settings: UserSettings) => repository.save(settings),
    onSuccess: (settings) => queryClient.setQueryData(userSettingsQueryKey, settings),
  })

  return {
    settings: query.data ?? defaultUserSettings,
    isLoading: query.isPending,
    error: query.error,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
    save: saveMutation.mutateAsync,
  }
}
