import {create} from 'zustand'

export interface IToastStore {
  title: string | null;
  description?: string | null,
  variant?: 'default' | 'destructive',
  update: (m: {title: string, description?: string, variant: 'default' | 'destructive'}) => void
}

export const useToastGlobal = create<IToastStore>(
  (set) => ({
    title: null,
    description: null,
    variant: 'default',
    update: async (m) => {
      set({
        ...m
      })
    }
  })
)