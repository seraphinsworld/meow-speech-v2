import type { LevelQuestion } from './level_question_builder.js'
import { InvalidLevelSubmissionError, type LevelResult } from './level_repository.js'

export function validateLevelResults(results: LevelResult[], questions: LevelQuestion[]) {
  if (!Array.isArray(results) || results.length !== questions.length) {
    throw new InvalidLevelSubmissionError()
  }

  const questionsById = new Map(questions.map((question) => [question.id, question]))
  const submittedQuestionIds = new Set<string>()
  const submittedWords = new Set<string>()

  for (const result of results) {
    const normalizedWord = validateResult(
      result,
      questionsById,
      submittedQuestionIds,
      submittedWords
    )
    submittedQuestionIds.add(result.questionId)
    submittedWords.add(normalizedWord)
  }
}

function validateResult(
  result: LevelResult,
  questionsById: Map<string, LevelQuestion>,
  submittedQuestionIds: Set<string>,
  submittedWords: Set<string>
): string {
  if (
    !result ||
    typeof result !== 'object' ||
    typeof result.questionId !== 'string' ||
    typeof result.correct !== 'boolean' ||
    typeof result.word !== 'string'
  ) {
    throw new InvalidLevelSubmissionError()
  }

  const question = questionsById.get(result.questionId)
  const word = normalizeWord(result.word)
  if (
    !question ||
    submittedQuestionIds.has(result.questionId) ||
    submittedWords.has(word) ||
    normalizeWord(question.vocabularyWord) !== word
  ) {
    throw new InvalidLevelSubmissionError()
  }
  return word
}

function normalizeWord(word: string) {
  return word.toLowerCase()
}
