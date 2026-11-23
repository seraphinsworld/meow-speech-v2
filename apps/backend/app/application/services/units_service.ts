import { getUnitRepository } from '../dependencies.js'

export class UnitsService {
  async userUnits(userId: number) {
    return getUnitRepository().userUnits(userId)
  }

  async userVocabulary(userId: number) {
    return getUnitRepository().userVocabulary(userId)
  }
}

export const UNIT_SERVICE = new UnitsService()
