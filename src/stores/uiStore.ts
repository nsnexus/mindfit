// ============================================
// UI Store (Zustand) — Sidebar, Theme, Modais
// ============================================
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMobileNavVisible: boolean;
  activeModal: string | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileNavVisible: (visible: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isMobileNavVisible: true,
  activeModal: null,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setMobileNavVisible: (visible) => set({ isMobileNavVisible: visible }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));
