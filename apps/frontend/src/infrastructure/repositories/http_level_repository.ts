import type { Level } from '../../domain/models/level.ts'
import { FindMistakeQuestion } from '../../domain/models/question/find_mistake_question.ts'
import { MissingPhonemeQuestion } from '../../domain/models/question/missing_phoneme_question.ts'
import type { Question, QuestionData } from '../../domain/models/question/question.ts'
import { WriteWholeQuestion } from '../../domain/models/question/write_whole_question.ts'
import type {
  LevelCompletion,
  LevelQuestionResult,
  LevelRepository,
} from '../../domain/repositories/level_repository.ts'
import { apiRequest } from '../http/api_client.ts'

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

type LevelResponse = { sessionId: number; keyboardPhonemes: string[]; questions: QuestionData[] }

export class HttpLevelRepository implements LevelRepository {
  async getLevel(unitId: number, levelNumber: number): Promise<Level> {
    const { data } = await apiRequest<{ data: LevelResponse }>(
      `/units/${unitId}/levels/${levelNumber}`
    )
    return { ...data, questions: data.questions.map(createQuestion) }
  }

  async completeLevel(
    unitId: number,
    levelNumber: number,
    sessionId: number,
    results: LevelQuestionResult[]
  ) {
    const { data } = await apiRequest<{ data: LevelCompletion }>(
      `/units/${unitId}/levels/${levelNumber}/complete`,
      {
        method: 'POST',
        body: JSON.stringify({ sessionId, results }),
      }
    )
    return data
  }
}
