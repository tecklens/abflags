import {create} from 'zustand'
import {RepositoryFactory} from '@client/api/repository-factory'
import {HttpStatusCode} from 'axios'
import {useToastGlobal} from '@client/lib/store/toastStore'
import {IPageRequest, IPageResponse} from "@client/types";

const AnalysisRepository = RepositoryFactory.get('anal')
const TriggerRepository = RepositoryFactory.get('trigger')

export interface IAnalData {
    count: number;
    date: string;
}

export interface AnalysisState {
    logs: IPageResponse<any>;
    taskErrors: IAnalData[];
    billings: IAnalData[];
    trigger: IAnalData[];
    fetchTriggerData: (period: string, event_type: string) => void;
    fetchLogsTrigger: (payload: IPageRequest) => void;
    fetchTaskError: (period: string, event_type: string) => void;
    fetchAnalBilling: (period: string, event_type: string) => void;
}

export const useAnalysis = create<AnalysisState>((set) => ({
    logs: {
        page: 0,
        data: [],
        pageSize: 0,
        totalCount: 0
    },
    taskErrors: [],
    trigger: [],
    billings: [],
    fetchTriggerData: async (period: string, event_type: string) => {
        const rsp = await AnalysisRepository.analyse({
            period: period,
            event_type,
        })

        if (rsp.status === HttpStatusCode.Ok) {
            set({
                trigger: rsp.data?.data
            })
        } else {
            useToastGlobal.getState().update({
                variant: 'destructive',
                title: 'Get Chart call api trigger failed'
            })
        }
    },
    fetchLogsTrigger: async (payload: IPageRequest) => {
        const rsp = await TriggerRepository.logs(payload)

        if (rsp.status === HttpStatusCode.Ok) {
            set({
                logs: rsp.data
            })
        } else {
            useToastGlobal.getState().update({
                title: 'Get Logs of Trigger',
                description: 'Get log request trigger of you is failed.',
                variant: 'destructive'
            })
        }
    },
    fetchTaskError: async (period: string, event_type: string) => {
        const rsp = await AnalysisRepository.analyseTaskError({
            period: period,
            event_type,
        })

        if (rsp.status === HttpStatusCode.Ok) {
            set({
                taskErrors: rsp.data?.data
            })
        } else {
            useToastGlobal.getState().update({
                variant: 'destructive',
                title: 'Get data analyse task execute error failed'
            })
        }
    },

    fetchAnalBilling: async (period: string, event_type: string) => {
        const rsp = await AnalysisRepository.analyseBilling({
            period: period,
            event_type,
        })

        if (rsp.status === HttpStatusCode.Ok) {
            set({
                billings: rsp.data?.data
            })
        } else {
            useToastGlobal.getState().update({
                variant: 'destructive',
                title: 'Get data analyse billing per month failed'
            })
        }
    }
}))
