import { BaseQuestion } from './base_question.ts'
import type { MissingPhonemeQuestionData, QuestionAnswer } from './question.ts'

export class MissingPhonemeQuestion extends BaseQuestion {
  readonly type = 'missing_phoneme' as const
  readonly answer: string
  readonly options: string[]
  readonly targetIndex: number
  readonly transcription: string[]

  constructor(data: MissingPhonemeQuestionData) {
    super(data.id, data.promptWord, data.pronunciationUrl, data.vocabularyWord)
    this.answer = data.answer
    this.options = [...data.options]
    this.targetIndex = data.targetIndex
    this.transcription = [...data.transcription]
  }

  checkAnswer(answer: QuestionAnswer): boolean {
    return answer.type === this.type && answer.phoneme === this.answer
  }
}
