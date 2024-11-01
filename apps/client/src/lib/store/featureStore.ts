import {create} from 'zustand'
import {RepositoryFactory} from '@client/api/repository-factory'
import {FeatureId, IFeature, IFeatureStrategy} from "@abflags/shared";
import {IPageResponse} from "@client/types";
import axios, {AxiosResponse, HttpStatusCode} from "axios";
import {useToastGlobal} from "@client/lib/store/toastStore";

const FeatureRepository = RepositoryFactory.get('feature')

export interface FeatureState {
  id: number;
  updateId: () => void;
  features: IPageResponse<IFeature>;
  fetchFeature: (params: any) => void;
  openNewFeature: boolean;
  setOpenNewFeature: (v: boolean) => void;
  strategies: IFeatureStrategy[];
  fetchStrategies: (featureId: FeatureId) => void;
  updateOrderStrategies: (featureId: FeatureId, newStrategies: IFeatureStrategy[]) => void;
}

export const useFeature = create<FeatureState>((set, getState) => ({
  id: 1,
  features: {
    page: 0,
    pageSize: 0,
    total: 0,
    data: []
  },
  strategies: [],
  openNewFeature: false,
  updateId: () => set({id: getState().id + 1}),
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
  updateOrderStrategies: async (featureId: FeatureId, newStrategies: IFeatureStrategy[]) => {
    FeatureRepository.updateOrderStrategy(featureId, newStrategies)
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          getState().fetchStrategies(featureId)
        } else {
          useToastGlobal.getState().update({
            variant: 'destructive',
            title: 'Update order strategy failed'
          })
        }
      })
      .catch((e: any) => {
        if (axios.isAxiosError(e)) {
          useToastGlobal.getState().update({
            variant: 'destructive',
            title: 'Update order strategy failed'
          })
        }
      })
  }
}))
