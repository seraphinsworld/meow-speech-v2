import type { Question } from './question/question.ts'

export type Level = {
  keyboardPhonemes: string[]
  questions: Question[]
}
