import {create} from 'zustand'
import {UserInterface} from '@client/types/user.interface'
import {RepositoryFactory} from '@client/api/repository-factory'
import {HttpStatusCode} from "axios";
import {useToastGlobal} from "@client/lib/store/toastStore";
import {useEnv} from "@client/lib/store/envStore";

const AuthRepository = RepositoryFactory.get('auth')
const UserRepository = RepositoryFactory.get('user')

export interface IUserStore {
  user: UserInterface | null;
  token: string | undefined;
  signIn: (user: UserInterface) => Promise<boolean>
  currentOrg: string | undefined;
  updateCurrentOrg: (orgId: string) => void
  updateUser: () => void
  sendUpdate: (user: UserInterface) => void
  switchEnv: (envId: string) => void
  switchOrg: (orgId: string) => void
  setToken: (token: string) => void
}

const initState = {
  user: null,
  token: localStorage.getItem("token") ?? undefined,
  currentOrg: undefined
}

export const useUser = create<IUserStore>(
  (set, getState) => ({
    ...initState,
    signIn: async (user: UserInterface) => {
      const rsp = await AuthRepository.login(user)

      if (rsp.data?.token) {

        localStorage.setItem('token', rsp.data?.token)

        return true
      }

      return false
    },
    updateUser: async () => {
      const info = await UserRepository.getInfoMe()
      useEnv.getState().fetchEnv()
      useEnv.getState().fetchAllEnv()
      set({user: info.data})
    },
    sendUpdate: async (user: UserInterface) => {
      const rsp = await UserRepository.update(user)

      if (rsp.status === HttpStatusCode.Ok) {
        set({
          user: rsp.data
        })
        useToastGlobal.getState().update({
          title: 'Update user',
          description: 'Update user info successful',
          variant: 'default'
        })
      } else {
        useToastGlobal.getState().update({
          title: 'Update user',
          description: 'Update info failed',
          variant: 'destructive'
        })
      }
    },
    switchEnv: async (envId: string) => {
      const rspToken = await AuthRepository.switchEnv(envId)

      localStorage.setItem('token', rspToken.data?.token)
      getState().setToken(rspToken.data?.token)
    },
    switchOrg: async (orgId: string) => {
      const rspToken = await AuthRepository.switchOrg(orgId)

      localStorage.setItem('token', rspToken.data)
      getState().setToken(rspToken.data)
    },
    setToken: async (token) => {
      set({
        token: token
      })

      if (token && token.length > 128) {
        localStorage.setItem('token', token);
        getState().updateUser()
      } else {
        localStorage.removeItem('token')
      }
    },

    updateCurrentOrg: (orgId: string) => {
      set({
        currentOrg: orgId
      })
    }
  })
)
