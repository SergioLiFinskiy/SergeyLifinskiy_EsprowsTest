import { create } from 'zustand'

export type JsonRow = Record<string, unknown>

interface JsonStore {
  data: JsonRow[]
  columns: string[]
  setData: (data: JsonRow[]) => void
  updateRow: (index: number, key: string, value: unknown) => void
  exportData: () => void
  reset: () => void
}

export const useJsonStore = create<JsonStore>((set, get) => ({
  data: [],
  columns: [],

  setData: (data: JsonRow[]) => {
    const columns = data.length > 0 ? Object.keys(data[0]) : []
    set({ data, columns })
  },

  updateRow: (index: number, key: string, value: unknown) => {
    set((state) => {
      const newData = [...state.data]
      newData[index] = { ...newData[index], [key]: value }
      return { data: newData }
    })
  },

  exportData: () => {
    const { data } = get()
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `edited-data-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  reset: () => {
    set({ data: [], columns: [] })
  },
}))
