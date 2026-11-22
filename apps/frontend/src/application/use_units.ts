import { useQuery } from '@tanstack/react-query'
import { getUnitRepository } from './dependencies'

export function useUnits(userId: number) {
  const unitRepository = getUnitRepository()
  const query = useQuery({
    queryKey: ['units', userId],
    queryFn: () => unitRepository.list(),
  })

  return {
    units: query.data ?? [],
    isLoading: query.isPending,
    error: query.error,
  }
}
