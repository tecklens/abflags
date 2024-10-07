import { FeatureId } from '@abflags/shared'
import BaseRepository from '@client/api/base-repository'

const resource = '/event'

export default {
  byFeatureId(id: FeatureId, params: any) {
    return BaseRepository.get(`${resource}/feature/${id}`, {params})
  },
  byProject(params: any) {
    return BaseRepository.get(`${resource}/project`, {params})
  },
}
