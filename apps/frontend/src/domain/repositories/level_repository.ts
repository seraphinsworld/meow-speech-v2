import type { Level } from '../models/level.ts'

export interface LevelRepository {
  getLevel(unitId: number, levelNumber: number): Promise<Level>
  completeLevel(
    unitId: number,
    levelNumber: number,
    sessionId: number,
    results: LevelQuestionResult[]
  ): Promise<LevelCompletion>
}

export type LevelQuestionResult = { questionId: string; word: string; correct: boolean }
export type LevelCompletion = {
  levelsCompleted: number
  score: { correctAnswers: number; mistakes: number; totalQuestions: number }
}
