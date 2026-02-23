import { create } from 'zustand';
import { mockTickets } from '../data/mockData';

export const useStore = create((set) => ({
    darkMode: false,
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    tickets: mockTickets,
    selectedTickets: [],
    setSelectedTickets: (tickets) => set({ selectedTickets: tickets }),
    filters: {
        priority: [],
        status: [],
        assignee: [],
        search: '',
    },
    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),
    viewMode: 'list',
    setViewMode: (mode) => set({ viewMode: mode }),
    getFilteredTickets: () => {
        const { tickets, filters } = useStore.getState();

        return tickets.filter(ticket => {
            if (filters.search && !ticket.title.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }
            if (filters.priority.length > 0 && !filters.priority.includes(ticket.priority)) {
                return false;
            }
            if (filters.status.length > 0 && !filters.status.includes(ticket.status)) {
                return false;
            }
            if (filters.assignee.length > 0 && !filters.assignee.includes(ticket.assignee.id)) {
                return false;
            }

            return true;
        });
    },
}));
