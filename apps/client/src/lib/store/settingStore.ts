import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface SettingState {
  font: string,
  updateSetting: (font: string) => void;
}

export const useSetting = create(
  persist<SettingState>((set) => ({
      font: 'ui-sans-serif',
      updateSetting: async (font: string) => {
        set({
          font,
        })
      },
    }),
    {
      name: 'setting', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ))
