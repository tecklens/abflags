import {create} from 'zustand'
import {RepositoryFactory} from "@client/api/repository-factory";
import {IApplication} from "@abflags/shared";
import {AxiosResponse, HttpStatusCode} from "axios";

const ApplicationRepository = RepositoryFactory.get('app')

export interface ApplicationState {
  apps: IApplication[] | undefined,
  fetchAllApp: () => void
}

export const useApp = create<ApplicationState>((set) => ({
  apps: undefined,
  fetchAllApp: () => {
    ApplicationRepository.all()
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          set({
            apps: resp.data
          })
        }
      })
  }
}))
