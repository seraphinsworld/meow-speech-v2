import { DateTime } from 'luxon'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import type { WordEntry } from '../../domain/units/vocabulary_scheduler.js'
import type { WordProgress, WordState } from '../../domain/units/vocabulary_scheduler.js'

type StoredWordProgress = {
  word: string
  state: WordState
  step: number
  next_due_at: number | null
  last_reviewed_at: number | null
}

export type StoredUnitProgress = {
  levels_completed: number
  completed_rounds: number
}

type StoredUnitLevel = { unit_id: number; levels_completed: number }

function fromStoredWord(row: StoredWordProgress): WordProgress {
  return {
    word: row.word,
    state: row.state,
    step: Number(row.step),
    nextDueAt: row.next_due_at === null ? null : Number(row.next_due_at),
    lastReviewedAt: row.last_reviewed_at === null ? null : Number(row.last_reviewed_at),
  }
}

export async function loadUnitProgress(
  userId: number,
  unitId: number,
  trx: TransactionClientContract
): Promise<StoredUnitProgress | null> {
  return (await trx
    .from('user_unit_progress')
    .where('user_id', userId)
    .where('unit_id', unitId)
    .first()) as StoredUnitProgress | null
}

export async function loadCompletedLevels(
  userId: number,
  trx: TransactionClientContract
): Promise<Map<number, number>> {
  const rows = (await trx
    .from('user_unit_progress')
    .select('unit_id', 'levels_completed')
    .where('user_id', userId)) as StoredUnitLevel[]
  return new Map(rows.map((row) => [Number(row.unit_id), Number(row.levels_completed)]))
}

export async function ensureUnitProgress(
  userId: number,
  unitId: number,
  trx: TransactionClientContract
) {
  await trx
    .table('user_unit_progress')
    .insert({
      user_id: userId,
      unit_id: unitId,
      levels_completed: 0,
      completed_rounds: 0,
      created_at: DateTime.now().toSQL(),
    })
    .onConflict(['user_id', 'unit_id'])
    .ignore()
}

export async function ensureWordProgress(
  userId: number,
  unitId: number,
  wordBank: WordEntry[],
  trx: TransactionClientContract
): Promise<WordProgress[]> {
  if (wordBank.length > 0) {
    const createdAt = DateTime.now().toSQL()
    await trx
      .table('user_unit_words')
      .insert(
        wordBank.map(({ word }) => ({
          user_id: userId,
          unit_id: unitId,
          word,
          state: 'unseen',
          step: 0,
          next_due_at: null,
          last_reviewed_at: null,
          created_at: createdAt,
        }))
      )
      .onConflict(['user_id', 'unit_id', 'word'])
      .ignore()
  }

  const rows = (await trx
    .from('user_unit_words')
    .where('user_id', userId)
    .where('unit_id', unitId)) as StoredWordProgress[]
  return rows.map(fromStoredWord)
}

export async function saveWordProgress(
  userId: number,
  unitId: number,
  progress: WordProgress[],
  trx: TransactionClientContract
) {
  for (const word of progress) {
    await trx
      .from('user_unit_words')
      .where('user_id', userId)
      .where('unit_id', unitId)
      .where('word', word.word)
      .update({
        state: word.state,
        step: word.step,
        next_due_at: word.nextDueAt,
        last_reviewed_at: word.lastReviewedAt,
      })
  }
}

export async function recordLevelCompletion(
  userId: number,
  unitId: number,
  level: number,
  trx: TransactionClientContract
): Promise<number> {
  await ensureUnitProgress(userId, unitId, trx)
  const progress = await loadUnitProgress(userId, unitId, trx)
  if (!progress) throw new Error('Could not load learner unit progress.')

  const levelsCompleted = Math.max(Number(progress.levels_completed), level)
  await trx
    .from('user_unit_progress')
    .where('user_id', userId)
    .where('unit_id', unitId)
    .update({
      levels_completed: levelsCompleted,
      completed_rounds: Number(progress.completed_rounds) + 1,
    })
  return levelsCompleted
}
