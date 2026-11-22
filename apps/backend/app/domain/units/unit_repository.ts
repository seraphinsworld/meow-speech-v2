import type { Unit } from './unit.js'

export interface UnitRepository {
  userUnits(userId: number): Promise<Unit[]>
}
