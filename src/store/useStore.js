import { create } from 'zustand';
import { mockTickets, mockNotifications, mockTeamMembers } from '../data/mockData';

export const useStore = create((set, get) => ({
    // Dark mode
    darkMode: false,
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

    // Sidebar
    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    // Tickets
    tickets: mockTickets,
    addTicket: (ticket) => set((state) => ({ tickets: [ticket, ...state.tickets] })),
    deleteTicket: (id) => set((state) => ({ tickets: state.tickets.filter(t => t.id !== id) })),
    updateTicket: (id, updates) => set((state) => ({
        tickets: state.tickets.map(t => t.id === id ? { ...t, ...updates } : t)
    })),

    selectedTickets: [],
    setSelectedTickets: (tickets) => set({ selectedTickets: tickets }),

    filters: { priority: [], status: [], assignee: [], search: '' },
    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),

    viewMode: 'list',
    setViewMode: (mode) => set({ viewMode: mode }),

    getFilteredTickets: () => {
        const { tickets, filters } = get();
        return tickets.filter(ticket => {
            if (filters.search && !ticket.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
            if (filters.priority.length > 0 && !filters.priority.includes(ticket.priority)) return false;
            if (filters.status.length > 0 && !filters.status.includes(ticket.status)) return false;
            if (filters.assignee.length > 0 && !filters.assignee.includes(ticket.assignee.id)) return false;
            return true;
        });
    },

    // Notifications
    notifications: mockNotifications,
    markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),
    markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),
    deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),
    getUnreadCount: () => get().notifications.filter(n => !n.read).length,

    // Team
    teamMembers: mockTeamMembers,
    addTeamMember: (member) => set((state) => ({ teamMembers: [...state.teamMembers, member] })),
    updateTeamMember: (id, updates) => set((state) => ({
        teamMembers: state.teamMembers.map(m => m.id === id ? { ...m, ...updates } : m)
    })),
    removeTeamMember: (id) => set((state) => ({
        teamMembers: state.teamMembers.filter(m => m.id !== id)
    })),

    // Settings
    settings: {
        profile: { name: 'John Doe', email: 'john@example.com', role: 'Developer', avatar: 'JD' },
        notifications: {
            emailTicketCreated: true, emailTicketUpdated: true, emailTicketResolved: false,
            pushTicketCreated: true, pushTicketUpdated: false, pushTicketResolved: true,
            inAppAll: true,
        },
        system: { autoAssign: true, slaEnabled: true, slaCritical: 4, slaHigh: 8, slaMedium: 24, slaLow: 72 },
        integrations: { slack: false, email: true, apiKeyGenerated: false },
    },
    updateSettings: (section, updates) => set((state) => ({
        settings: { ...state.settings, [section]: { ...state.settings[section], ...updates } }
    })),
}));
