import type { UnitDefinition } from './unit.js'
import type { LevelSession } from './level_repository.js'
import type { WordEntry } from './vocabulary_scheduler.js'
import { buildLevelQuestions } from './level_question_builder.js'

type LevelRoundSnapshot = {
  id: number
  seed: string
  scheduled_words: string
}

export function buildLevelSession(
  round: LevelRoundSnapshot,
  unit: UnitDefinition,
  wordBank: WordEntry[]
): LevelSession {
  const words = parseScheduledWords(round.scheduled_words)
  const entries = resolveScheduledEntries(words, wordBank)
  const questions = buildLevelQuestions(entries, unit.activePhonemes, round.seed)

  return {
    sessionId: Number(round.id),
    keyboardPhonemes: [...new Set(entries.flatMap((entry) => entry.phonemes))],
    questions,
  }
}

function parseScheduledWords(serializedWords: string): string[] {
  const parsed: unknown = JSON.parse(serializedWords)
  if (!Array.isArray(parsed) || !parsed.every((word) => typeof word === 'string')) {
    throw new InvalidStoredLevelRoundError()
  }
  return parsed
}

function resolveScheduledEntries(words: string[], wordBank: WordEntry[]): WordEntry[] {
  const entryByWord = new Map(wordBank.map((entry) => [entry.word.toLowerCase(), entry]))
  const entries = words.map((word) => entryByWord.get(word.toLowerCase()))
  if (entries.some((entry) => entry === undefined) || entries.length < 8) {
    throw new InvalidStoredLevelRoundError()
  }
  return entries as WordEntry[]
}

export class InvalidStoredLevelRoundError extends Error {
  constructor() {
    super('Stored level round does not match its word bank.')
  }
}
