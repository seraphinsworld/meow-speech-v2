export type VocabularyWord = { word: string; ipa: string }

export type UnitVocabulary =
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
