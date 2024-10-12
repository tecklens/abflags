import {create} from 'zustand'
import {RepositoryFactory} from '@client/api/repository-factory'
import {FeatureId, IFeature, IFeatureStrategy} from "@abflags/shared";
import {IPageResponse} from "@client/types";
import {AxiosResponse, HttpStatusCode} from "axios";

const FeatureRepository = RepositoryFactory.get('feature')

export interface FeatureState {
  features: IPageResponse<IFeature>;
  fetchFeature: (params: any) => void;
  openNewFeature: boolean;
  setOpenNewFeature: (v: boolean) => void;
  strategies: IFeatureStrategy[];
  fetchStrategies: (featureId: FeatureId) => void;
}

export const useFeature = create<FeatureState>((set) => ({
  features: {
    page: 0,
    pageSize: 0,
    total: 0,
    data: []
  },
  strategies: [],
  openNewFeature: false,
  fetchFeature: async (params: any) => {
    FeatureRepository.all(params).then((rsp: AxiosResponse) => {
      if (rsp.status === HttpStatusCode.Ok) {
        set({
          features: rsp.data
        })
      }
    })
  },
  setOpenNewFeature: (v) => set({openNewFeature: v}),
  fetchStrategies: (featureId: FeatureId) => {
    FeatureRepository.getAllStrategy(featureId)
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          set({
            strategies: resp.data
          })
        }
      })
      .catch(() => {
        set({
          strategies: []
        })
      })
  },
}))
