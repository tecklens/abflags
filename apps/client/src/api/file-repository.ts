import BaseRepository from '@client/api/base-repository.ts'
import { UserInterface } from '@/types/user.interface.ts'

const resource = '/file'

export default {
  uploadFile(file: File) {
    let formData = new FormData();
    formData.append('file', file)
    return BaseRepository.post(`${resource}/upload`, formData)
  },
}
