import BaseRepository from '@client/api/base-repository'

const resource = '/project'

export default {
  all(params: any) {
    return BaseRepository.get(`${resource}`, {params})
  },
  active() {
    return BaseRepository.get(`${resource}/active`)
  },
  byId(id: string) {
    return BaseRepository.get(`${resource}/${id}`)
  },
  insights(id: string) {
    return BaseRepository.get(`${resource}/insight`)
  },
  create(payload: any) {
    return BaseRepository.post(`${resource}/`, payload)
  },
  members() {
    return BaseRepository.get(`${resource}/members`)
  },
  variables(params: any) {
    return BaseRepository.get(`${resource}/variables`, {params})
  },
  delMember(id: string) {
    return BaseRepository.delete(`${resource}/member/${id}`)
  },
  inviteMembers(payload: any) {
    return BaseRepository.post(`${resource}/invite`, payload)
  },
  resendInviteMembers(payload: any) {
    return BaseRepository.post(`${resource}/invite/resend`, payload)
  },
  getInviteData(token: string) {
    return BaseRepository.get(`${resource}/invite/${token}`)
  },
  acceptInvite(token: string) {
    return BaseRepository.post(`${resource}/invite/${token}/accept`)
  },
  createVariable(payload: any) {
    return BaseRepository.post(`${resource}/variable`, payload)
  },
}
