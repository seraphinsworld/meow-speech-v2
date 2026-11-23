export type WordState = 'unseen' | 'learning' | 'known'

export type WordProgress = {
  word: string
  state: WordState
  step: number
  nextDueAt: number | null
  lastReviewedAt: number | null
}

export type WordEntry = { word: string; ipa: string; phonemes: string[] }
export type ScheduledWord = { entry: WordEntry; progress: WordProgress; introduced: boolean }
export type WordResult = { word: string; correct: boolean }
