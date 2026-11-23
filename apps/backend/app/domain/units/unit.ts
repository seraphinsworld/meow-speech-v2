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
  private readonly previousUnitCompleted: boolean | null

  constructor(
    definition: UnitDefinition,
    levelsCompleted: number,
    previousUnitCompleted: boolean | null
  ) {
    this.#definition = definition
    this.id = definition.id
    this.slug = definition.slug
    this.title = definition.title
    this.activePhonemes = [...definition.activePhonemes]
    this.totalLevels = definition.totalLevels
    this.levelsCompleted = levelsCompleted
    this.previousUnitCompleted = previousUnitCompleted
    this.isUnlocked = definition.id === 1 || previousUnitCompleted === true
    this.currentLevel = this.isUnlocked
      ? definition.id === 1 && levelsCompleted === 0
        ? 0
        : Math.min(levelsCompleted + 1, definition.totalLevels)
      : 0
    this.isActive = Array.from({ length: definition.totalLevels }, (_, index) => index + 1).some(
      (level) => this.isLevelActive(level)
    )
  }

  get isCompleted() {
    return this.levelsCompleted === this.totalLevels
  }

  isLevelActive(level: number) {
    if (!Number.isInteger(level) || level < 1 || level > this.totalLevels || !this.isUnlocked) {
      return false
    }

    return level <= this.currentLevel || (this.id === 1 && level === 1)
  }

  canValidateLevel(level: number) {
    return this.isActive && level === this.levelsCompleted + 1 && this.isLevelActive(level)
  }

  /** Returns a new progression state after validating the expected next level. */
  completeLevel(level: number): Unit {
    if (!this.isActive) {
      throw new UnitProgressionError('This unit is not active for the user.')
    }

    if (!this.canValidateLevel(level)) {
      throw new UnitProgressionError(`Expected level ${this.levelsCompleted + 1}.`)
    }

    return new Unit(
      this.#definition,
      this.levelsCompleted + 1,
      this.previousUnitCompleted
    )
  }
}
