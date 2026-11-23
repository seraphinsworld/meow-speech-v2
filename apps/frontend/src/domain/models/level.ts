import type { Question } from './question/question.ts'

export type Level = {
  sessionId: number
  keyboardPhonemes: string[]
  questions: Question[]
}
