import BaseRepository from '@client/api/base-repository'

const resource = '/project'

export default {
  all() {
    return BaseRepository.get(`${resource}`)
  },
  active() {
    return BaseRepository.get(`${resource}/active`)
  },
  byId(id: string) {
    return BaseRepository.get(`${resource}/${id}`)
  },
  members() {
    return BaseRepository.get(`${resource}/members`)
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
}
