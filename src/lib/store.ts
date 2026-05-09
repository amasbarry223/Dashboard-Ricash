import { create } from "zustand"

export type PageKey =
  | "dashboard"
  | "users"
  | "kyc"
  | "transactions"
  | "agents"
  | "partners"
  | "notifications"
  | "configuration"
  | "settings"

interface AppStore {
  currentPage: PageKey
  setCurrentPage: (page: PageKey) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  currentPage: "dashboard",
  setCurrentPage: (page) => set({ currentPage: page }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
