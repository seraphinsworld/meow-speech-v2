import { useQuery } from '@tanstack/react-query'
import { getUnitRepository } from './dependencies'

export function useUnits() {
  const unitRepository = getUnitRepository()
  const query = useQuery({
    queryKey: ['units'],
    queryFn: () => unitRepository.list(),
  })

  return {
    units: query.data ?? [],
    isLoading: query.isPending,
    error: query.error,
  }
}
