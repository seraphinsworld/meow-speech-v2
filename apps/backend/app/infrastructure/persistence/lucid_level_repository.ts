import { randomUUID } from 'node:crypto'
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { DateTime } from 'luxon'
import { applyResults, scheduleWords } from '../../domain/units/vocabulary_scheduler.js'
import { buildLevelSession } from '../../domain/units/level_session_factory.js'
import {
  ActiveLevelSessionError,
  InvalidLevelSubmissionError,
  LevelNotFoundError,
  type LevelCompletion,
  type LevelRepository,
  type LevelResult,
} from '../../domain/units/level_repository.js'
import { type UnitDefinition } from '../../domain/units/unit.js'
import { unitDefinitions } from '../../domain/units/unit_definitions.js'
import { createUserUnitProgression } from '../../domain/units/user_unit_progression.js'
import { validateLevelResults } from '../../domain/units/level_result_validator.js'
import {
  createLevelRound,
  findActiveLevelRound,
  findActiveLevelRoundById,
  markLevelRoundCompleted,
  type StoredLevelRound,
} from './level_round_store.js'
import { loadUnitWordBank } from './unit_word_bank.js'
import {
  ensureUnitProgress,
  ensureWordProgress,
  loadCompletedLevels,
  loadUnitProgress,
  recordLevelCompletion,
  saveWordProgress,
} from './unit_progress_store.js'

const QUESTIONS_PER_ROUND = 11
const MINIMUM_PLAYABLE_WORDS = 8

export class LucidLevelRepository implements LevelRepository {
  async getLevel(userId: number, unitId: number, level: number) {
    const unit = requireUnit(unitId)
    const wordBank = await loadUnitWordBank(unit)

    return this.withTransaction(async (trx) => {
      await lockLearnerProgress(userId, trx)
      await assertLevelIsPlayable(userId, unit, level, trx)

      const activeRound = await findActiveLevelRound(userId, unitId, trx)
      if (activeRound) return this.resumeRound(activeRound, unit, level, wordBank)

      return this.startRound(userId, unit, level, wordBank, trx)
    })
  }

  async complete(
    userId: number,
    unitId: number,
    level: number,
    sessionId: number,
    results: LevelResult[]
  ): Promise<LevelCompletion> {
    const unit = requireUnit(unitId)
    const wordBank = await loadUnitWordBank(unit)

    return this.withTransaction(async (trx) => {
      await lockLearnerProgress(userId, trx)
      const round = await findActiveLevelRoundById(userId, unitId, level, sessionId, trx)
      if (!round) throw new InvalidLevelSubmissionError()

      const session = buildLevelSession(round, unit, wordBank)
      validateLevelResults(results, session.questions)
      await this.applyWordResults(userId, unitId, wordBank, results, trx)

      const levelsCompleted = await recordLevelCompletion(userId, unitId, level, trx)
      await markLevelRoundCompleted(sessionId, trx)
      return buildCompletionSummary(levelsCompleted, results)
    })
  }

  private async resumeRound(
    round: StoredLevelRound,
    unit: UnitDefinition,
    requestedLevel: number,
    wordBank: Awaited<ReturnType<typeof loadUnitWordBank>>
  ) {
    if (Number(round.level) !== requestedLevel) {
      throw new ActiveLevelSessionError(Number(round.level))
    }
    return buildLevelSession(round, unit, wordBank)
  }

  private async startRound(
    userId: number,
    unit: UnitDefinition,
    level: number,
    wordBank: Awaited<ReturnType<typeof loadUnitWordBank>>,
    trx: TransactionClientContract
  ) {
    await ensureUnitProgress(userId, unit.id, trx)
    const unitProgress = await loadUnitProgress(userId, unit.id, trx)
    const wordProgress = await ensureWordProgress(userId, unit.id, wordBank, trx)
    const scheduledWords = scheduleWords({
      wordBank,
      progress: wordProgress,
      capacity: unit.learningCapacity,
      questionCount: QUESTIONS_PER_ROUND,
      now: Date.now(),
      activePhonemes: unit.activePhonemes,
    })

    if (scheduledWords.length < MINIMUM_PLAYABLE_WORDS) throw new LevelNotFoundError()
    await saveWordProgress(
      userId,
      unit.id,
      scheduledWords.filter((word) => word.introduced).map((word) => word.progress),
      trx
    )

    const round = await createLevelRound(
      {
        userId,
        unitId: unit.id,
        level,
        roundNumber: Number(unitProgress?.completed_rounds ?? 0) + 1,
        seed: randomUUID(),
        words: scheduledWords.map((word) => word.entry.word),
      },
      trx
    )
    return buildLevelSession(round, unit, wordBank)
  }

  private async applyWordResults(
    userId: number,
    unitId: number,
    wordBank: Awaited<ReturnType<typeof loadUnitWordBank>>,
    results: LevelResult[],
    trx: TransactionClientContract
  ) {
    const currentProgress = await ensureWordProgress(userId, unitId, wordBank, trx)
    const updatedProgress = applyResults(currentProgress, results, Date.now())
    const reviewedWords = new Set(results.map((result) => normalizeWord(result.word)))
    await saveWordProgress(
      userId,
      unitId,
      updatedProgress.filter((word) => reviewedWords.has(normalizeWord(word.word))),
      trx
    )
  }

  private async withTransaction<T>(
    operation: (trx: TransactionClientContract) => Promise<T>
  ): Promise<T> {
    const trx = await db.transaction()
    try {
      const result = await operation(trx)
      await trx.commit()
      return result
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}

function requireUnit(unitId: number): UnitDefinition {
  const unit = unitDefinitions.find((definition) => definition.id === unitId)
  if (!unit) throw new LevelNotFoundError()
  return unit
}

async function lockLearnerProgress(userId: number, trx: TransactionClientContract) {
  await trx.from('users').where('id', userId).update({ updated_at: DateTime.now().toSQL() })
}

function buildCompletionSummary(levelsCompleted: number, results: LevelResult[]): LevelCompletion {
  const correctAnswers = results.filter((result) => result.correct).length
  return {
    levelsCompleted,
    score: {
      correctAnswers,
      mistakes: results.length - correctAnswers,
      totalQuestions: results.length,
    },
  }
}

function normalizeWord(word: string) {
  return word.toLowerCase()
}

async function assertLevelIsPlayable(
  userId: number,
  definition: UnitDefinition,
  level: number,
  trx: TransactionClientContract
) {
  const completedLevels = await loadCompletedLevels(userId, trx)
  const progression = createUserUnitProgression(definition, completedLevels)
  if (!Number.isInteger(level) || !progression.isLevelActive(level)) {
    throw new LevelNotFoundError()
  }
}
