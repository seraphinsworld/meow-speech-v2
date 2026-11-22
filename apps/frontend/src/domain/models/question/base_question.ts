import type { QuestionAnswer, QuestionType } from './question.ts'

export abstract class BaseQuestion {
  abstract readonly type: QuestionType

  constructor(
    readonly id: string,
    readonly promptWord: string,
    readonly pronunciationUrl: string,
    readonly vocabularyWord: string
  ) {}

  abstract checkAnswer(answer: QuestionAnswer): boolean
}
