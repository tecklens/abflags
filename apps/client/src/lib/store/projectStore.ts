import {create} from 'zustand'
import {RepositoryFactory} from '@client/api/repository-factory'
import {AxiosError, AxiosResponse, HttpStatusCode} from 'axios'
import {useToastGlobal} from '@client/lib/store/toastStore'
import {IProject, ProjectDto} from "@abflags/shared";

const ProjectRepository = RepositoryFactory.get('project')
const FileRepository = RepositoryFactory.get('file')

export interface OrgState {
  members: any[];
  fetchMembers: () => void;
  activeProject: ProjectDto | undefined;
  fetchActiveProject: () => void;
  projects: IProject[];
  fetchProjects: () => void;
  openSelectProject: boolean;
  setOpenSelectProject: (v: boolean) => void;
}

export const useProject = create<OrgState>((set) => ({
  activeProject: undefined,
  openSelectProject: false,
  members: [],
  projects: [],
  fetchMembers: async () => {
    const rsp = await ProjectRepository.members();

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        members: rsp.data
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get Members of Organization failed'
      })
    }
  },
  updateBrand: async (payload: { logo?: File | string | undefined, color?: string, font?: string }) => {
    let logoUrl = null;
    if (payload.logo && typeof payload.logo != 'string') {
      const uploadResp = await FileRepository.uploadFile(payload.logo)
      if (uploadResp.status == HttpStatusCode.Created) {
        logoUrl = uploadResp.data
      } else {
        useToastGlobal.getState().update({
          variant: 'destructive',
          title: 'File upload failed',
        })
      }
    } else {
      logoUrl = payload.logo
    }

    ProjectRepository.updateBrand({
      ...payload,
      logo: logoUrl
    }).then((updateBrandResp: AxiosResponse) => {
      if (updateBrandResp.status === HttpStatusCode.Ok) {
        useToastGlobal.getState().update({
          variant: 'default',
          title: 'Update brand successful',
        })
      } else {
        useToastGlobal.getState().update({
          variant: 'destructive',
          title: 'Updating the organization\'s brand failed',
        })
      }
    }).catch((e: AxiosError) => {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: e.message,
      })
    })
  },
  fetchActiveProject: async () => {
    ProjectRepository.active().then((rsp: AxiosResponse) => {
      if (rsp.status === HttpStatusCode.Ok) {
        set({
          activeProject: rsp.data
        })
      }
    })
  },
  fetchProjects: async () => {
    ProjectRepository.all().then((rsp: AxiosResponse) => {
      if (rsp.status === HttpStatusCode.Ok) {
        set({
          projects: rsp.data
        })
      }
    })
  },
  setOpenSelectProject: (v: boolean) => set({openSelectProject: v})
}))
