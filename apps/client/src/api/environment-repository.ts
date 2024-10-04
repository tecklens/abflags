import BaseRepository from '@client/api/base-repository'

const resource = '/environment'

export default {

  getMe() {
    return BaseRepository.get(`${resource}/me`)
  },
  apiKeys() {
    return BaseRepository.get(`${resource}/api-keys`)
  },
  list() {
    return BaseRepository.get(`${resource}`)
  },
}
