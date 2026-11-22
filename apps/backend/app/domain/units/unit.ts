export type UnitDefinition = {
  id: number
  slug: string
  title: string
  activePhonemes: string[]
  totalLevels: number
}

export class UnitProgressionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnitProgressionError'
  }
}

/** A shared unit definition combined with one user's progression context. */
export class Unit {
  readonly id: number
  readonly slug: string
  readonly title: string
  readonly activePhonemes: string[]
  readonly totalLevels: number
  readonly levelsCompleted: number
  readonly isActive: boolean
  readonly currentLevel: number
  private readonly previousUnitCompleted: boolean | null

  constructor(
    definition: UnitDefinition,
    levelsCompleted: number,
    previousUnitCompleted: boolean | null
  ) {
    this.id = definition.id
    this.slug = definition.slug
    this.title = definition.title
    this.activePhonemes = [...definition.activePhonemes]
    this.totalLevels = definition.totalLevels
    this.levelsCompleted = levelsCompleted
    this.previousUnitCompleted = previousUnitCompleted
    this.isActive =
      levelsCompleted < definition.totalLevels &&
      (previousUnitCompleted === null || previousUnitCompleted)
    this.currentLevel = this.levelsCompleted
  }

  get isCompleted() {
    return this.levelsCompleted === this.totalLevels
  }

  canValidateLevel(level: number) {
    return this.isActive && level === this.currentLevel + 1
  }

  /** Returns a new progression state after validating the expected next level. */
  completeLevel(level: number): Unit {
    if (!this.isActive) {
      throw new UnitProgressionError('This unit is not active for the user.')
    }

    if (!this.canValidateLevel(level)) {
      throw new UnitProgressionError(`Expected level ${this.currentLevel + 1}.`)
    }

    return new Unit(
      {
        id: this.id,
        slug: this.slug,
        title: this.title,
        activePhonemes: this.activePhonemes,
        totalLevels: this.totalLevels,
      },
      this.levelsCompleted + 1,
      this.previousUnitCompleted
    )
  }
}
