import { getUnitRepository } from '../dependencies.js'

export class UnitsService {
  async userUnits(userId: number) {
    return getUnitRepository().userUnits(userId)
  }
}

export const UNIT_SERVICE = new UnitsService()
