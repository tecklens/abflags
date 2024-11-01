import BaseRepository from '@client/api/base-repository'

const resource = '/metric'

export default {
  analyse(params: any) {
    return BaseRepository.get(`${resource}/anal`, {
      params: params
    })
  },
}
