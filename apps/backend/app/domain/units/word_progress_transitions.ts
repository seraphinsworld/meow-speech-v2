import type { WordProgress, WordResult } from './vocabulary_types.js'

export const learningIntervals = [5 * 60_000, 60 * 60_000, 24 * 60 * 60_000] as const
const finalLearningStep = learningIntervals.length - 1

export function applyResults(
  progress: WordProgress[],
  results: WordResult[],
  now: number
): WordProgress[] {
  const resultByWord = groupResultsByWord(results)
  return progress.map((word) =>
    updateReviewedWord(word, resultByWord.get(normalizeWord(word.word)), now)
  )
}

function groupResultsByWord(results: WordResult[]) {
  const resultByWord = new Map<string, boolean>()
  for (const result of results) {
    const word = normalizeWord(result.word)
    resultByWord.set(word, (resultByWord.get(word) ?? true) && result.correct)
  }
  return resultByWord
}

function updateReviewedWord(
  word: WordProgress,
  correct: boolean | undefined,
  now: number
): WordProgress {
  if (word.state === 'unseen' || correct === undefined) return word
  if (word.state === 'known') return { ...word, lastReviewedAt: now }
  if (isEarlySuccessfulReview(word, correct, now)) return { ...word, lastReviewedAt: now }
  if (isFirstReview(word)) return scheduleFirstReview(word, now)
  if (isFinalSuccessfulReview(word, correct)) return graduateWord(word, now)
  return scheduleNextReview(word, correct, now)
}

function isEarlySuccessfulReview(word: WordProgress, correct: boolean, now: number) {
  return correct && word.lastReviewedAt !== null && (word.nextDueAt ?? 0) > now
}

function isFirstReview(word: WordProgress) {
  return word.lastReviewedAt === null
}

function scheduleFirstReview(word: WordProgress, now: number): WordProgress {
  return {
    ...word,
    step: 0,
    lastReviewedAt: now,
    nextDueAt: now + learningIntervals[0],
  }
}

function isFinalSuccessfulReview(word: WordProgress, correct: boolean) {
  return correct && word.step >= finalLearningStep
}

function graduateWord(word: WordProgress, now: number): WordProgress {
  return { ...word, state: 'known', nextDueAt: null, lastReviewedAt: now }
}

function scheduleNextReview(word: WordProgress, correct: boolean, now: number): WordProgress {
  const step = correct ? Math.min(word.step + 1, finalLearningStep) : Math.max(word.step - 1, 0)
  return {
    ...word,
    step,
    lastReviewedAt: now,
    nextDueAt: now + learningIntervals[step],
  }
}

function normalizeWord(word: string) {
  return word.toLowerCase()
}
