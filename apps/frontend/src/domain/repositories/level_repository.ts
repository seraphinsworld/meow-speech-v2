import type { Level } from '../models/level.ts'

export interface LevelRepository {
  getLevel(unitId: number, levelNumber: number): Promise<Level>
}
