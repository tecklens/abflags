import { FeatureId } from '@abflags/shared'
import BaseRepository from '@client/api/base-repository'

const resource = '/feature'

export default {
  all(params: any) {
    return BaseRepository.get(`${resource}`, {params})
  },
  create(payload: any) {
    return BaseRepository.post(`${resource}`, payload)
  },
  byId(id: FeatureId) {
    return BaseRepository.get(`${resource}/${id}`)
  },
}
