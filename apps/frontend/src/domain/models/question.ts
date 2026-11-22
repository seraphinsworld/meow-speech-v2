export type QuestionBase = {
  id: string
  promptWord: string
  pronunciationUrl: string
  vocabularyWord: string
}

export type WriteWholeQuestion = QuestionBase & {
  answerPhonemes: string[]
  type: 'write_whole'
}

export type MissingPhonemeQuestion = QuestionBase & {
  answer: string
  options: string[]
  targetIndex: number
  transcription: string[]
  type: 'missing_phoneme'
}

export type FindMistakeQuestion = QuestionBase & {
  displayedTranscription: string[]
  expectedPhoneme: string | null
  hasMistake: boolean
  wrongIndex: number | null
  wrongPhoneme: string | null
  type: 'find_mistake'
}

/** The three question formats used by the V1 level runner. */
export type Question = WriteWholeQuestion | MissingPhonemeQuestion | FindMistakeQuestion

export type QuestionAnswer =
  | { type: 'write_whole'; phonemes: string[] }
  | { type: 'missing_phoneme'; phoneme: string }
  | { type: 'find_mistake'; wrongIndex: number | null }

export function isAnswerCorrect(question: Question, answer: QuestionAnswer): boolean {
  if (question.type !== answer.type) return false

  switch (question.type) {
    case 'write_whole':
      return (
        answer.type === 'write_whole' &&
        answer.phonemes.join('') === question.answerPhonemes.join('')
      )
    case 'missing_phoneme':
      return answer.type === 'missing_phoneme' && answer.phoneme === question.answer
    case 'find_mistake':
      return (
        answer.type === 'find_mistake' &&
        answer.wrongIndex === (question.hasMistake ? question.wrongIndex : null)
      )
  }
}
