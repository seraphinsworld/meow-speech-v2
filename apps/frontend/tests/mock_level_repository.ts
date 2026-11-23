import type { Level } from '../src/domain/models/level.ts'
import { createQuestion } from '../src/infrastructure/repositories/http_level_repository.ts'
import type { QuestionData } from '../src/domain/models/question/question.ts'
import type { LevelRepository } from '../src/domain/repositories/level_repository.ts'

const mockLevel = {
  sessionId: 0,
  keyboardPhonemes: ['ʃ', 's', 'h', 'ɪ', 'i', 'p', 'ɛ'],
  questions: [
    {
      id: 'write-ship',
      type: 'write_whole',
      promptWord: 'ship',
      vocabularyWord: 'ship',
      pronunciationUrl: '/pronunciations/ship.mp3',
      answerPhonemes: ['ʃ', 'ɪ', 'p'],
    },
    {
      id: 'missing-sheep',
      type: 'missing_phoneme',
      promptWord: 'sheep',
      vocabularyWord: 'sheep',
      pronunciationUrl: '/pronunciations/sheep.mp3',
      transcription: ['ʃ', 'i', 'p'],
      targetIndex: 1,
      options: ['ɪ', 'i', 'ɛ'],
      answer: 'i',
    },
    {
      id: 'mistake-sheep',
      type: 'find_mistake',
      promptWord: 'sheep',
      vocabularyWord: 'sheep',
      pronunciationUrl: '/pronunciations/sheep.mp3',
      displayedTranscription: ['ʃ', 'ɪ', 'p'],
      hasMistake: true,
      wrongIndex: 1,
      wrongPhoneme: 'ɪ',
      expectedPhoneme: 'i',
    },
    {
      id: 'no-mistake-ship',
      type: 'find_mistake',
      promptWord: 'ship',
      vocabularyWord: 'ship',
      pronunciationUrl: '/pronunciations/ship.mp3',
      displayedTranscription: ['ʃ', 'ɪ', 'p'],
      hasMistake: false,
      wrongIndex: null,
      wrongPhoneme: null,
      expectedPhoneme: null,
    },
  ],
} satisfies Omit<Level, 'questions'> & { questions: QuestionData[] }

export class MockLevelRepository implements LevelRepository {
  async getLevel(_unitId: number, _levelNumber: number): Promise<Level> {
    return {
      sessionId: mockLevel.sessionId,
      keyboardPhonemes: [...mockLevel.keyboardPhonemes],
      questions: mockLevel.questions.map(createQuestion),
    }
  }

  async completeLevel(
    _unitId: number,
    _levelNumber: number,
    _sessionId: number,
    results: Array<{ correct: boolean }>
  ) {
    const correctAnswers = results.filter((result) => result.correct).length
    return {
      levelsCompleted: 1,
      score: {
        correctAnswers,
        mistakes: results.length - correctAnswers,
        totalQuestions: results.length,
      },
    }
  }
}
