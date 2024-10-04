import BaseRepository from '@client/api/base-repository.ts'
import { UserInterface } from '@/types/user.interface.ts'

const resource = '/auth'

export default {
  login(payload: UserInterface) {
    return BaseRepository.post(`${resource}/login`, payload)
  },
  register(payload: UserInterface) {
    return BaseRepository.post(`${resource}/register`, payload)
  },
  checkGithubAuth() {
    return BaseRepository.get(`${resource}/github/check`)
  },
  checkGoogleAuth() {
    return BaseRepository.get(`${resource}/google/check`)
  },
  googleAuth() {
    return BaseRepository.get(`${resource}/google`)
  },
  githubAuthCallback(payload: any) {
    return BaseRepository.get(`${resource}/github/callback`, {
      params: payload,
    })
  },
  sendEmailResetPass(payload: UserInterface) {
    return BaseRepository.post(`${resource}/reset/request`, payload)
  },
  forgotPass(payload: UserInterface) {
    return BaseRepository.post(`${resource}/reset`, payload)
  },
  switchEnv(envId: string) {
    return BaseRepository.post(`${resource}/environments/${envId}/switch`)
  },
  getRemainingRequest() {
    return BaseRepository.get(`${resource}/limit/remaining`)
  },
  switchOrg(organizationId: string) {
    return BaseRepository.post(`${resource}/organizations/${organizationId}/switch`)
  }
}
