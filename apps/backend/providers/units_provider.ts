import { setUnitRepository } from '../app/application/dependencies.js'
import { LucidUnitRepository } from '../app/infrastructure/persistence/lucid_unit_repository.js'

export default class UnitsProvider {
  async boot() {
    setUnitRepository(new LucidUnitRepository())
  }
}
