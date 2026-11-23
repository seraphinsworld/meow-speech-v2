import type { LevelQuestion } from './level_question_builder.js'

export type LevelSession = {
  sessionId: number
  keyboardPhonemes: string[]
  questions: LevelQuestion[]
}

export type LevelResult = { questionId: string; word: string; correct: boolean }
export type LevelCompletion = {
  levelsCompleted: number
  score: { correctAnswers: number; mistakes: number; totalQuestions: number }
}

export interface LevelRepository {
  getLevel(userId: number, unitId: number, level: number): Promise<LevelSession>
  complete(
    userId: number,
    unitId: number,
    level: number,
    sessionId: number,
    results: LevelResult[]
  ): Promise<LevelCompletion>
}

export class LevelNotFoundError extends Error {}
export class ActiveLevelSessionError extends Error {
  constructor(readonly activeLevel: number) {
    super('An unfinished level session already exists.')
  }
}
export class InvalidLevelSubmissionError extends Error {}
