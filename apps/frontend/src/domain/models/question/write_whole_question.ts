import { BaseQuestion } from './base_question.ts'
import type { QuestionAnswer, WriteWholeQuestionData } from './question.ts'

export class WriteWholeQuestion extends BaseQuestion {
  readonly type = 'write_whole' as const
  readonly answerPhonemes: string[]

  constructor(data: WriteWholeQuestionData) {
    super(data.id, data.promptWord, data.pronunciationUrl, data.vocabularyWord)
    this.answerPhonemes = [...data.answerPhonemes]
  }

  checkAnswer(answer: QuestionAnswer): boolean {
    return answer.type === this.type && answer.phonemes.join('') === this.answerPhonemes.join('')
  }
}
