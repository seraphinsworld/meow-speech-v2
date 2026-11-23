import { DateTime } from 'luxon'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export type StoredLevelRound = {
  id: number
  level: number
  current_round: number
  seed: string
  scheduled_words: string
}

export async function findActiveLevelRound(
  userId: number,
  unitId: number,
  trx: TransactionClientContract
): Promise<StoredLevelRound | null> {
  return (await trx
    .from('unit_round_sessions')
    .where('user_id', userId)
    .where('unit_id', unitId)
    .where('state', 'active')
    .first()) as StoredLevelRound | null
}

export async function findPausedLevelRound(
  userId: number,
  unitId: number,
  level: number,
  trx: TransactionClientContract
): Promise<StoredLevelRound | null> {
  return (await trx
    .from('unit_round_sessions')
    .where('user_id', userId)
    .where('unit_id', unitId)
    .where('level', level)
    .where('state', 'paused')
    .orderBy('id', 'desc')
    .first()) as StoredLevelRound | null
}

export async function pauseLevelRound(roundId: number, trx: TransactionClientContract) {
  await trx
    .from('unit_round_sessions')
    .where('id', roundId)
    .where('state', 'active')
    .update({ state: 'paused' })
}

export async function resumeLevelRound(roundId: number, trx: TransactionClientContract) {
  await trx
    .from('unit_round_sessions')
    .where('id', roundId)
    .where('state', 'paused')
    .update({ state: 'active' })
}

export async function createLevelRound(
  {
    userId,
    unitId,
    level,
    roundNumber,
    seed,
    words,
  }: {
    userId: number
    unitId: number
    level: number
    roundNumber: number
    seed: string
    words: string[]
  },
  trx: TransactionClientContract
): Promise<StoredLevelRound> {
  const [roundId] = await trx.table('unit_round_sessions').insert({
    user_id: userId,
    unit_id: unitId,
    level,
    current_round: roundNumber,
    seed,
    scheduled_words: JSON.stringify(words),
    state: 'active',
    created_at: DateTime.now().toSQL(),
  })

  const round = (await trx.from('unit_round_sessions').where('id', roundId).first()) as
    StoredLevelRound | undefined
  if (!round) throw new Error('Could not load the newly created level round.')
  return round
}

export async function findActiveLevelRoundById(
  userId: number,
  unitId: number,
  level: number,
  roundId: number,
  trx: TransactionClientContract
): Promise<StoredLevelRound | null> {
  return (await trx
    .from('unit_round_sessions')
    .where('id', roundId)
    .where('user_id', userId)
    .where('unit_id', unitId)
    .where('level', level)
    .where('state', 'active')
    .first()) as StoredLevelRound | null
}

export async function markLevelRoundCompleted(roundId: number, trx: TransactionClientContract) {
  await trx
    .from('unit_round_sessions')
    .where('id', roundId)
    .update({ state: 'completed', completed_at: DateTime.now().toSQL() })
}
