import {create} from 'zustand'
import {RepositoryFactory} from "@client/api/repository-factory";
import axios, {AxiosResponse, HttpStatusCode} from "axios";
import {useToastGlobal} from "@client/lib/store/toastStore";

const MetricRepository = RepositoryFactory.get('metric')

export interface MetricState {
  metrics: any[];
  fetchMetric: (period: string, featureName: string) => void
}

export const useMetric = create<MetricState>((set) => ({
  metrics: [],
  fetchMetric: async (period: string, featureName: string) => {
    MetricRepository.analyse({period, featureName})
      .then((resp: AxiosResponse) => {
        if (resp.status === HttpStatusCode.Ok) {
          set({
            metrics: resp.data
          })
        } else {
          useToastGlobal.getState().update({
            variant: 'destructive',
            title: 'Get metric of feature error'
          })
        }
      }).catch((err: any) => {
      if (axios.isAxiosError(err)) {
        useToastGlobal.getState().update({
          variant: 'destructive',
          title: 'Get metric of feature error'
        })
      }
    })
  }
}))
