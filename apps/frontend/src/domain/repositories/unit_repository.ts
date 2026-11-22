import type { Unit } from '../models/units'

export interface UnitRepository {
  list(): Promise<Unit[]>
}
