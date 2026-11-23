export type UnitDefinition = {
  id: number
  slug: string
  title: string
  activePhonemes: string[]
  totalLevels: number
  wordBankCsvPath: string
  learningCapacity: number
}

export class UnitProgressionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnitProgressionError'
  }
}

/** A shared unit definition combined with one user's progression context. */
export class Unit {
  readonly #definition: UnitDefinition
  readonly id: number
  readonly slug: string
  readonly title: string
  readonly activePhonemes: string[]
  readonly totalLevels: number
  readonly levelsCompleted: number
  readonly isActive: boolean
  readonly currentLevel: number
  private readonly isUnlocked: boolean
  private readonly previousUnitHasCompletedLevel: boolean | null

  constructor(
    definition: UnitDefinition,
    levelsCompleted: number,
    previousUnitHasCompletedLevel: boolean | null
  ) {
    this.#definition = definition
    this.id = definition.id
    this.slug = definition.slug
    this.title = definition.title
    this.activePhonemes = [...definition.activePhonemes]
    this.totalLevels = definition.totalLevels
    this.levelsCompleted = levelsCompleted
    this.previousUnitHasCompletedLevel = previousUnitHasCompletedLevel
    this.isUnlocked = definition.id === 1 || previousUnitHasCompletedLevel === true
    this.currentLevel =
      this.isUnlocked && levelsCompleted < definition.totalLevels ? levelsCompleted + 1 : 0
    this.isActive = this.isUnlocked && (levelsCompleted > 0 || this.currentLevel > 0)
  }

  get isCompleted() {
    return this.levelsCompleted >= this.totalLevels
  }

  isLevelActive(level: number) {
    if (!Number.isInteger(level) || level < 1 || level > this.totalLevels || !this.isUnlocked) {
      return false
    }

    return this.currentLevel > 0 && level === this.currentLevel
  }

  canPlayLevel(level: number) {
    if (!Number.isInteger(level) || level < 1 || level > this.totalLevels || !this.isUnlocked) {
      return false
    }

    return level <= this.levelsCompleted || this.isLevelActive(level)
  }

  canValidateLevel(level: number) {
    return this.canPlayLevel(level)
  }

  /** Returns a new progression state after completing a playable level or replay. */
  completeLevel(level: number): Unit {
    if (!this.isActive) {
      throw new UnitProgressionError('This unit is not active for the user.')
    }

    if (!this.canPlayLevel(level)) {
      throw new UnitProgressionError(`Expected level ${this.levelsCompleted + 1}.`)
    }

    return new Unit(
      this.#definition,
      Math.max(this.levelsCompleted, level),
      this.previousUnitHasCompletedLevel
    )
  }
}
