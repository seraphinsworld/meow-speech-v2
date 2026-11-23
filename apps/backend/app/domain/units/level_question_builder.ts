import type { WordEntry } from './vocabulary_scheduler.js'

type BaseQuestion = {
  id: string
  promptWord: string
  pronunciationUrl: string
  vocabularyWord: string
}
type WriteQuestion = BaseQuestion & { type: 'write_whole'; answerPhonemes: string[] }
type MissingQuestion = BaseQuestion & {
  type: 'missing_phoneme'
  answer: string
  options: string[]
  targetIndex: number
  transcription: string[]
}
type MistakeQuestion = BaseQuestion & {
  type: 'find_mistake'
  displayedTranscription: string[]
  expectedPhoneme: string | null
  hasMistake: boolean
  wrongIndex: number | null
  wrongPhoneme: string | null
}
export type LevelQuestion = WriteQuestion | MissingQuestion | MistakeQuestion

const randomForSeed = (seed: string) => {
  let value = 1779033703
  for (let index = 0; index < seed.length; index++)
    value = Math.imul(value ^ seed.charCodeAt(index), 3432918353)
  return () => {
    value = Math.imul(value ^ (value >>> 16), 2246822507)
    value = Math.imul(value ^ (value >>> 13), 3266489909)
    value ^= value >>> 16
    return (value >>> 0) / 4294967296
  }
}

const shuffle = <T>(items: T[], random: () => number) => {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap]!, result[index]!]
  }
  return result
}

const findTeachingPhonemeIndex = (entry: WordEntry, targets: string[]) =>
  Math.max(
    0,
    entry.phonemes.findIndex((phoneme) => targets.includes(phoneme))
  )
const createBaseQuestion = (entry: WordEntry, id: string): BaseQuestion => ({
  id,
  promptWord: entry.word,
  pronunciationUrl: `/pronunciations/${encodeURIComponent(entry.word)}.mp3`,
  vocabularyWord: entry.word,
})

function missingQuestion(
  entry: WordEntry,
  targets: string[],
  random: () => number,
  index: number
): MissingQuestion {
  const target = findTeachingPhonemeIndex(entry, targets)
  const answer = entry.phonemes[target]!
  return {
    ...createBaseQuestion(entry, `missing-${index}-${entry.word}`),
    type: 'missing_phoneme',
    answer,
    options: shuffle([...new Set([answer, ...targets])], random),
    targetIndex: target,
    transcription: [...entry.phonemes],
  }
}

function mistakeQuestion(
  entry: WordEntry,
  targets: string[],
  random: () => number,
  index: number
): MistakeQuestion {
  const wrongIndex = findTeachingPhonemeIndex(entry, targets)
  const correct = entry.phonemes[wrongIndex]!
  const alternatives = shuffle(
    targets.filter((phoneme) => phoneme !== correct),
    random
  )
  const hasMistake = alternatives.length > 0 && random() >= 0.4
  const wrongPhoneme = hasMistake ? alternatives[0]! : null
  const displayed = [...entry.phonemes]
  if (wrongPhoneme) displayed[wrongIndex] = wrongPhoneme
  return {
    ...createBaseQuestion(entry, `mistake-${index}-${entry.word}`),
    type: 'find_mistake',
    displayedTranscription: displayed,
    expectedPhoneme: hasMistake ? correct : null,
    hasMistake,
    wrongIndex: hasMistake ? wrongIndex : null,
    wrongPhoneme,
  }
}

export function buildLevelQuestions(
  entries: WordEntry[],
  targets: string[],
  seed: string
): LevelQuestion[] {
  const random = randomForSeed(`${seed}:questions`)
  const questions: LevelQuestion[] = []
  entries.slice(0, 4).forEach((entry, index) =>
    questions.push({
      ...createBaseQuestion(entry, `write-${index}-${entry.word}`),
      type: 'write_whole',
      answerPhonemes: [...entry.phonemes],
    })
  )
  entries
    .slice(4, 8)
    .forEach((entry, index) => questions.push(missingQuestion(entry, targets, random, index)))
  entries
    .slice(8, 11)
    .forEach((entry, index) => questions.push(mistakeQuestion(entry, targets, random, index)))
  return shuffle(questions, random)
}
