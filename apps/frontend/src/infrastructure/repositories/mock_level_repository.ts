import type { Level } from '../../domain/models/level.ts'
import type { LevelRepository } from '../../domain/repositories/level_repository.ts'

const mockLevel: Level = {
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
}

export class MockLevelRepository implements LevelRepository {
  async getLevel(_unitId: number, _levelNumber: number): Promise<Level> {
    return mockLevel
  }
}
