import type { Phoneme, Question } from './question.ts'

export type Level = {
  keyboardPhonemes: Phoneme[]
  questions: Question[]
}
