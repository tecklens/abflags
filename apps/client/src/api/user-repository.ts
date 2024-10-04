import BaseRepository from '@client/api/base-repository'
import {IUser} from "@abflags/shared";

const resource = '/user'

export default {

  getInfoMe() {
    return BaseRepository.get(`${resource}/me`)
  },
  update(payload: IUser) {
    return BaseRepository.put(`${resource}/profile`, payload)
  },
  createPaymentIndent(payload: any) {
    return BaseRepository.post(`/payment/create-payment-indent`, payload)
  },
  updateGuide(type: string) {
    return BaseRepository.put(`${resource}/guide/${type}`)
  },
  submitBug(payload: any) {
    return BaseRepository.post(`${resource}/bug/submit`, payload)
  },
  sendChangePassword() {
    return BaseRepository.post(`${resource}/send-email-change-pass`)
  },
  changePassword(payload: any) {
    return BaseRepository.post(`${resource}/change-pass`, payload)
  },
}
