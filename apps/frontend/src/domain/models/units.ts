export type Unit = {
  id: number
  slug: string
  title: string
  activePhonemes: string[]
  levelsCompleted: number
  currentLevel: number
  totalLevels: number
  isActive: boolean
}

export function isLevelActive(unit: Unit, level: number): boolean {
  return unit.currentLevel > 0 && level === unit.currentLevel
}

export function isLevelCompleted(unit: Unit, level: number): boolean {
  return (
    Number.isInteger(level) && level >= 1 && level <= unit.totalLevels && level <= unit.levelsCompleted
  )
}

export function isLevelPlayable(unit: Unit, level: number): boolean {
  return isLevelActive(unit, level) || isLevelCompleted(unit, level)
}

export function isUnitActive(unit: Unit): boolean {
  return unit.isActive
}
