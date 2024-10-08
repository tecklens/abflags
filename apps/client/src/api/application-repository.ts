import BaseRepository from '@client/api/base-repository'

const resource = '/application'

export default {
  all() {
    return BaseRepository.get(`${resource}/all`)
  },
}
