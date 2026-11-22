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
  return level <= unit.currentLevel || (unit.id === 1 && level === 1)
}

export function isUnitActive(unit: Unit): boolean {
  return Array.from({ length: unit.totalLevels }, (_, index) => index + 1).some((level) =>
    isLevelActive(unit, level)
  )
}
