import {
  setLevelRepository,
  setUnitRepository,
  setUserSettingsRepository,
} from '../app/application/dependencies.js'
import { LucidLevelRepository } from '../app/infrastructure/persistence/lucid_level_repository.js'
import { LucidUnitRepository } from '../app/infrastructure/persistence/lucid_unit_repository.js'
import { LucidUserSettingsRepository } from '../app/infrastructure/persistence/lucid_user_settings_repository.js'

export default class UnitsProvider {
  async boot() {
    setUnitRepository(new LucidUnitRepository())
    setLevelRepository(new LucidLevelRepository())
    setUserSettingsRepository(new LucidUserSettingsRepository())
  }
}
