import {FeatureId, FeatureStrategyId} from '@abflags/shared'
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
  uploadStrategy(id: FeatureId, payload: any) {
    return BaseRepository.put(`${resource}/${id}/strategy`, payload)
  },
  getAllStrategy(id: FeatureId) {
    return BaseRepository.get(`${resource}/${id}/strategy`)
  },
  updateOrderStrategy(featureId: FeatureId, data: any) {
    return BaseRepository.put(`${resource}/${featureId}/strategy/order`, data)
  },
  enableStrategy(id: FeatureId, strategyId: FeatureStrategyId) {
    return BaseRepository.put(`${resource}/${id}/strategy/${strategyId}/enable`)
  },
  disableStrategy(id: FeatureId, strategyId: FeatureStrategyId) {
    return BaseRepository.put(`${resource}/${id}/strategy/${strategyId}/disable`)
  },
  deleteStrategy(id: FeatureId, strategyId: FeatureStrategyId) {
    return BaseRepository.delete(`${resource}/${id}/strategy/${strategyId}`)
  },
  totalByType() {
    return BaseRepository.get(`${resource}/feature-by-type`)
  },
  analysisCustomer(params: any) {
    return BaseRepository.get(`${resource}/anal-customer`, {params})
  },
  updateDescription(id: FeatureId, payload: any) {
    return BaseRepository.put(`${resource}/${id}/update/description`, payload)
  },
}
