import {create} from 'zustand'
import {RepositoryFactory} from '@client/api/repository-factory'
import {AxiosError, AxiosResponse, HttpStatusCode} from 'axios'
import {useToastGlobal} from '@client/lib/store/toastStore'
import {IEvent, IPaginatedResponseDto, IProject, IProjectInsight, IVariable, ProjectDto} from '@abflags/shared';

const ProjectRepository = RepositoryFactory.get('project')
const FileRepository = RepositoryFactory.get('file')
const EventRepository = RepositoryFactory.get('event')

export interface OrgState {
  insights: IProjectInsight | undefined;
  fetchInsights: () => void;
  members: any[];
  fetchMembers: () => void;
  variables: IPaginatedResponseDto<IVariable>;
  fetchVariables: (params: any) => void;
  activeProject: ProjectDto | undefined;
  fetchActiveProject: () => void;
  projects: IProject[];
  fetchProjects: (params: any) => void;
  openSelectProject: boolean;
  setOpenSelectProject: (v: boolean) => void;
  eventLogs: IPaginatedResponseDto<IEvent>;
  fetchEventLogs: (params: any) => void;
  eventLogsFeature: IPaginatedResponseDto<IEvent>;
  fetchEventLogsFeature: (id: string, params: any) => void;
}

export const useProject = create<OrgState>((set) => ({
  insights: undefined,
  activeProject: undefined,
  openSelectProject: false,
  members: [],
  variables: {
    page: 0,
    pageSize: 10,
    data: [],
    total: 0
  },
  eventLogs: {
    page: 0,
    pageSize: 10,
    data: [],
    total: 0
  },
  eventLogsFeature: {
    page: 0,
    pageSize: 10,
    data: [],
    total: 0
  },
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
  fetchVariables: async (params: any) => {
    const rsp = await ProjectRepository.variables(params);

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        variables: rsp.data
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get variables of project failed'
      })
    }
  },
  fetchEventLogs: async (params: any) => {
    const rsp = await EventRepository.byProject(params);

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        eventLogs: rsp.data
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get event logs of project failed'
      })
    }
  },
  fetchEventLogsFeature: async (id: string, params: any) => {
    const rsp = await EventRepository.byFeatureId(id, params);

    if (rsp.status === HttpStatusCode.Ok) {
      set({
        eventLogsFeature: rsp.data
      })
    } else {
      useToastGlobal.getState().update({
        variant: 'destructive',
        title: 'Get event logs of feature failed'
      })
    }
  },
  updateBrand: async (payload: { logo?: File | string | undefined, color?: string, font?: string }) => {
    let logoUrl = null;
    if (payload.logo && typeof payload.logo != 'string') {
      const uploadResp = await FileRepository.uploadFile(payload.logo)
      if (uploadResp.status === HttpStatusCode.Created) {
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
  fetchProjects: async (params: any) => {
    ProjectRepository.all(params).then((rsp: AxiosResponse) => {
      if (rsp.status === HttpStatusCode.Ok) {
        set({
          projects: rsp.data
        })
      }
    })
  },
  setOpenSelectProject: (v: boolean) => set({openSelectProject: v}),
  fetchInsights: () => {
    ProjectRepository.insights().then((resp: AxiosResponse) => {
      if (resp.status === HttpStatusCode.Ok) {
        set({
          insights: resp.data
        })
      } else {
        useToastGlobal.getState().update({
          variant: 'destructive',
          title: 'An error occurred while retrieving project information.'
        })
      }
    })
      .catch(() => {
        useToastGlobal.getState().update({
          variant: 'destructive',
          title: 'An error occurred while retrieving project information.'
        })
      })
  }
}))
