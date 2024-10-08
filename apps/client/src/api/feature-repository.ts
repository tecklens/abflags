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
  archive(id: FeatureId) {
    return BaseRepository.put(`${resource}/${id}/archive`)
  },
  enable(id: FeatureId) {
    return BaseRepository.put(`${resource}/${id}/enable`)
  },
  createStrategy(id: FeatureId, payload: any) {
    return BaseRepository.post(`${resource}/${id}/strategy`, payload)
  },
  getAllStrategy(id: FeatureId) {
    return BaseRepository.get(`${resource}/${id}/strategy`)
  }
}
