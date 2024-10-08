import BaseRepository from '@client/api/base-repository'
import {IUser} from "@abflags/shared";

const resource = '/auth'

export default {
  login(payload: IUser) {
    return BaseRepository.post(`${resource}/login`, payload)
  },
  register(payload: IUser) {
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
  sendEmailResetPass(payload: IUser) {
    return BaseRepository.post(`${resource}/reset/request`, payload)
  },
  forgotPass(payload: IUser) {
    return BaseRepository.post(`${resource}/reset`, payload)
  },
  switchEnv(envId: string) {
    return BaseRepository.post(`${resource}/environments/${envId}/switch`)
  },
  getRemainingRequest() {
    return BaseRepository.get(`${resource}/limit/remaining`)
  },
  switchProject(projectId: string) {
    return BaseRepository.post(`${resource}/project/${projectId}/switch`)
  }
}
