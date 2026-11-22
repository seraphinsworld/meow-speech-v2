import type { FindMistakeQuestion } from './find_mistake_question.ts'
import type { MissingPhonemeQuestion } from './missing_phoneme_question.ts'
import type { WriteWholeQuestion } from './write_whole_question.ts'

export type { FindMistakeQuestion } from './find_mistake_question.ts'
export type { MissingPhonemeQuestion } from './missing_phoneme_question.ts'
export type { WriteWholeQuestion } from './write_whole_question.ts'

export type Phoneme = string

export type QuestionBaseData = {
  id: string
  promptWord: string
  pronunciationUrl: string
  vocabularyWord: string
}

export type WriteWholeQuestionData = QuestionBaseData & {
  answerPhonemes: Phoneme[]
  type: 'write_whole'
}

export type MissingPhonemeQuestionData = QuestionBaseData & {
  answer: Phoneme
  options: Phoneme[]
  targetIndex: number
  transcription: Phoneme[]
  type: 'missing_phoneme'
}

export type FindMistakeQuestionData = QuestionBaseData & {
  displayedTranscription: Phoneme[]
  expectedPhoneme: Phoneme | null
  hasMistake: boolean
  wrongIndex: number | null
  wrongPhoneme: Phoneme | null
  type: 'find_mistake'
}

export type QuestionData =
  WriteWholeQuestionData | MissingPhonemeQuestionData | FindMistakeQuestionData

export type Question = WriteWholeQuestion | MissingPhonemeQuestion | FindMistakeQuestion
export type QuestionType = Question['type']

export type QuestionAnswer =
  | { type: 'write_whole'; phonemes: Phoneme[] }
  | { type: 'missing_phoneme'; phoneme: Phoneme }
  | { type: 'find_mistake'; wrongIndex: number | null }
