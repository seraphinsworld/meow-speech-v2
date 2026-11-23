import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../infrastructure/http/api_client.ts'
import type { UnitVocabulary } from '../domain/models/vocabulary.ts'

export function useVocabulary() {
  const query = useQuery({
    queryKey: ['vocabulary'],
    queryFn: async () => {
      const response = await apiRequest<{ data: UnitVocabulary[] }>('/account/vocabulary')
      return response.data
    },
  })

  return { units: query.data ?? [], isLoading: query.isPending, error: query.error }
}
