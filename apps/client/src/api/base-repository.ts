import { toast } from '@client/components/ui/use-toast'
import axios from 'axios'

export const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN
export const BASE_URL = `${BASE_DOMAIN}/ab/v1`

const instance = axios.create({
  baseURL: BASE_URL,
})

export default instance

const errorHandler = (error: any) => {
  toast({
    title: `${error.response.data.message}`,
    draggable: true,
    variant: 'destructive',

  })

  return Promise.resolve(error)
}

instance.interceptors.request.use(config => {
  config.headers.Authorization = localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : null

  return config
})

instance.interceptors.response.use(
  (response) => {

    return response
  },
  async (error) => {
    const originalRequest = error.config
    const serverCallUrl = originalRequest.url
    const status = error.response.status

    if (status === 401 && !window.location.href?.includes('/sign-in')){
      // let token = await refreshAccessToken()
      // setAccessToken(token)

      // originalRequest._retry = true
      // originalRequest.headers.authorization = `Bearer ${token}`

      // return axios(originalRequest)
      // return errorHandler(error)
      localStorage.removeItem('token')
      window.location.href = '/sign-in'
      // return errorHandler(error)
    } else return errorHandler(error)
  })
