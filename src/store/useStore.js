import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set) => ({
            // UI State
            darkMode: false,
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
            sidebarCollapsed: false,
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

            // Selected Team State
            currentTeam: null,
            setCurrentTeam: (team) => set({ currentTeam: team }),
        }),
        {
            name: 'ticket-app-storage',
            partialize: (state) => ({
                darkMode: state.darkMode,
                currentTeam: state.currentTeam,
                sidebarCollapsed: state.sidebarCollapsed
            }),
        }
    )
);
