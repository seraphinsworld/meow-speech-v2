import type { Unit } from './unit.js'

export interface UnitRepository {
  userUnits(userId: number): Promise<Unit[]>
  userVocabulary(userId: number): Promise<UserUnitVocabulary[]>
}

export type VocabularyWord = { word: string; ipa: string }
export type UserUnitVocabulary =
  | { id: number; locked: true }
  | {
      id: number
      locked: false
      title: string
      slug: string
      activePhonemes: string[]
      knownWords: VocabularyWord[]
      learningWords: VocabularyWord[]
    }
