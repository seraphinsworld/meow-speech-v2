import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getLevelRepository } from './dependencies.ts'
import type { LevelQuestionResult } from '../domain/repositories/level_repository.ts'

export type CompletionStatus = 'pending' | 'saving' | 'saved' | 'error'

type Options = {
  enabled: boolean
  unitId: number
  levelNumber: number
  sessionId: number | null
  results: LevelQuestionResult[]
}

export function useLevelCompletion({ enabled, unitId, levelNumber, sessionId, results }: Options) {
  const queryClient = useQueryClient()
  const submittedSessionId = useRef<number | null>(null)
  const [status, setStatus] = useState<CompletionStatus>('pending')
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(async () => {
    if (sessionId === null) return
    setStatus('saving')
    setError(null)
    try {
      await getLevelRepository().completeLevel(unitId, levelNumber, sessionId, results)
      setStatus('saved')
      await queryClient.invalidateQueries({ queryKey: ['units'] })
    } catch (reason) {
      setStatus('error')
      setError(reason instanceof Error ? reason.message : 'Unable to save your progress.')
    }
  }, [levelNumber, queryClient, results, sessionId, unitId])

  useEffect(() => {
    if (!enabled || sessionId === null || submittedSessionId.current === sessionId) return
    submittedSessionId.current = sessionId
    void submit()
  }, [enabled, sessionId, submit])

  return { status, error, retry: submit }
}
