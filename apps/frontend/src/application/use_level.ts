import { useQuery } from '@tanstack/react-query'
import { getLevelRepository } from './dependencies.ts'

export function useLevel(unitId: number, levelNumber: number) {
  const repository = getLevelRepository()
  const query = useQuery({
    queryKey: ['level', unitId, levelNumber],
    queryFn: () => repository.getLevel(unitId, levelNumber),
  })

  return {
    level: query.data,
    isLoading: query.isPending,
    error: query.error,
  }
}
