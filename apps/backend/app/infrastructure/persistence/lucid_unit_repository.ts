import db from '@adonisjs/lucid/services/db'
import { unitDefinitions } from '../../domain/units/unit_definitions.js'
import { Unit } from '../../domain/units/unit.js'
import type { UnitRepository, UserUnitVocabulary } from '../../domain/units/unit_repository.js'
import { loadUnitWordBank } from './unit_word_bank.js'

type UnitProgressRow = {
  unit_id: number
  levels_completed: number
}

export class LucidUnitRepository implements UnitRepository {
  async userUnits(userId: number): Promise<Unit[]> {
    const progressRows = (await db
      .from('user_unit_progress')
      .select('unit_id', 'levels_completed')
      .where('user_id', userId)) as UnitProgressRow[]
    const levelsCompletedByUnitId = new Map(
      progressRows.map((progress) => [progress.unit_id, progress.levels_completed])
    )

    return unitDefinitions.map((definition, index) => {
      const previousDefinition = unitDefinitions[index - 1]
      const previousUnitHasCompletedLevel = previousDefinition
        ? (levelsCompletedByUnitId.get(previousDefinition.id) ?? 0) >= 1
        : null

      return new Unit(
        definition,
        levelsCompletedByUnitId.get(definition.id) ?? 0,
        previousUnitHasCompletedLevel
      )
    })
  }

  async userVocabulary(userId: number): Promise<UserUnitVocabulary[]> {
    const progressRows = (await db
      .from('user_unit_progress')
      .select('unit_id', 'levels_completed')
      .where('user_id', userId)) as UnitProgressRow[]
    const levelsCompletedByUnitId = new Map(
      progressRows.map((progress) => [Number(progress.unit_id), Number(progress.levels_completed)])
    )
    const storedWords = (await db
      .from('user_unit_words')
      .select('unit_id', 'word', 'state')
      .where('user_id', userId)
      .whereIn('state', ['learning', 'known'])) as Array<{
      unit_id: number
      word: string
      state: 'learning' | 'known'
    }>
    const wordsByUnit = new Map<number, Map<string, 'learning' | 'known'>>()
    for (const row of storedWords) {
      const unitId = Number(row.unit_id)
      const byWord = wordsByUnit.get(unitId) ?? new Map()
      byWord.set(row.word.toLocaleLowerCase(), row.state)
      wordsByUnit.set(unitId, byWord)
    }

    return Promise.all(
      unitDefinitions.map(async (definition, index): Promise<UserUnitVocabulary> => {
        const previous = unitDefinitions[index - 1]
        const unit = new Unit(
          definition,
          levelsCompletedByUnitId.get(definition.id) ?? 0,
          previous ? (levelsCompletedByUnitId.get(previous.id) ?? 0) >= 1 : null
        )
        if (!unit.isActive) return { id: definition.id, locked: true }

        const progress = wordsByUnit.get(definition.id) ?? new Map()
        const bank = await loadUnitWordBank(definition)
        return {
          id: definition.id,
          locked: false,
          title: definition.title,
          slug: definition.slug,
          activePhonemes: [...definition.activePhonemes],
          knownWords: bank
            .filter(({ word }) => progress.get(word.toLocaleLowerCase()) === 'known')
            .map(({ word, ipa }) => ({ word, ipa })),
          learningWords: bank
            .filter(({ word }) => progress.get(word.toLocaleLowerCase()) === 'learning')
            .map(({ word, ipa }) => ({ word, ipa })),
        }
      })
    )
  }
}
