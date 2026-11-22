import { BaseQuestion } from './base_question.ts'
import type { FindMistakeQuestionData, QuestionAnswer } from './question.ts'

export class FindMistakeQuestion extends BaseQuestion {
  readonly type = 'find_mistake' as const
  readonly displayedTranscription: string[]
  readonly expectedPhoneme: string | null
  readonly hasMistake: boolean
  readonly wrongIndex: number | null
  readonly wrongPhoneme: string | null

  constructor(data: FindMistakeQuestionData) {
    super(data.id, data.promptWord, data.pronunciationUrl, data.vocabularyWord)
    this.displayedTranscription = [...data.displayedTranscription]
    this.expectedPhoneme = data.expectedPhoneme
    this.hasMistake = data.hasMistake
    this.wrongIndex = data.wrongIndex
    this.wrongPhoneme = data.wrongPhoneme
  }

  checkAnswer(answer: QuestionAnswer): boolean {
    if (answer.type !== this.type) return false
    return answer.wrongIndex === (this.hasMistake ? this.wrongIndex : null)
  }
}
