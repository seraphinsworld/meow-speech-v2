import type { UnitRepository } from '../../domain/repositories/unit_repository'
import type { Unit } from '../../domain/models/units'
import { apiRequest } from '../http/api_client'

export class HttpUnitRepository implements UnitRepository {
  async list(): Promise<Unit[]> {
    const response = await apiRequest<{ data: Unit[] }>('/units')
    return response.data
  }
}
