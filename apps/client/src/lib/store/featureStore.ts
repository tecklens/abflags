import {create} from 'zustand'
import {RepositoryFactory} from '@client/api/repository-factory'
import {IFeature} from "@abflags/shared";
import {IPageResponse} from "@client/types";
import {AxiosResponse, HttpStatusCode} from "axios";

const FeatureRepository = RepositoryFactory.get('feature')

export interface FeatureState {
  features: IPageResponse<IFeature>;
  fetchFeature: (params: any) => void;
  openNewFeature: boolean;
  setOpenNewFeature: (v: boolean) => void;
}

export const useFeature = create<FeatureState>((set) => ({
  features: {
    page: 0,
    pageSize: 0,
    total: 0,
    data: []
  },
  openNewFeature: false,
  fetchFeature: async (params: any) => {
    FeatureRepository.all().then((rsp: AxiosResponse) => {
      if (rsp.status === HttpStatusCode.Ok) {
        set({
          features: rsp.data
        })
      }
    })
  },
  setOpenNewFeature: (v) => set({openNewFeature: v})
}))
