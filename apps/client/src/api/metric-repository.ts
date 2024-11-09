import BaseRepository from '@client/api/base-repository'

const resource = '/metric'

export default {
  analyse(params: any) {
    return BaseRepository.get(`${resource}/anal`, {
      params: params
    })
  },
  analyseProject() {
    return BaseRepository.get(`${resource}/anal-project`)
  },
  analyseByEnv() {
    return BaseRepository.get(`${resource}/anal-project-env`)
  },
}
