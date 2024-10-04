import BaseRepository from '@client/api/base-repository.ts'
import {UserInterface} from "@/types/user.interface.ts";

const resource = '/notification'

export default {

  list(page: number, limit: number) {
    return BaseRepository.get(`${resource}?page=${page}&limit=${limit}`)
  },
  markAll() {
    return BaseRepository.put(`${resource}/mark-all`)
  },
  mark(id: string) {
    return BaseRepository.put(`${resource}/mark/${id}`)
  },
}
