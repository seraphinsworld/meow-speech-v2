import { FindMistakeQuestion } from '../../domain/models/question/find_mistake_question.ts'
import { MissingPhonemeQuestion } from '../../domain/models/question/missing_phoneme_question.ts'
import type { Question, QuestionData } from '../../domain/models/question/question.ts'
import { WriteWholeQuestion } from '../../domain/models/question/write_whole_question.ts'

export function createQuestion(data: QuestionData): Question {
  switch (data.type) {
    case 'write_whole':
      return new WriteWholeQuestion(data)
    case 'missing_phoneme':
      return new MissingPhonemeQuestion(data)
    case 'find_mistake':
      return new FindMistakeQuestion(data)
  }
}
