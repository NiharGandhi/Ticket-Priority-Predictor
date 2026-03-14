import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ticketsAPI, teamsAPI, usersAPI, authAPI } from '../services/api';
import { setAuthToken } from '../services/api';
import { mockTickets, mockTeams, mockUsers, mockNotifications } from '../data/mockData';

export const useStore = create(
    persist(
        (set, get) => ({
            // UI
            darkMode: false,
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
            sidebarCollapsed: false,
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

            // Auth
            token: typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null,
            user: null,
            authLoading: false,
            authError: null,
            setAuth: (user, token) => {
                if (token) setAuthToken(token);
                set(() => ({ user, token }));
            },
            logout: () => {
                setAuthToken(null);
                set(() => ({ user: null, token: null }));
            },
            loadMe: async () => {
                set({ authLoading: true });
                try {
                    const res = await authAPI.getMe();
                    set({ user: res.data.data, authLoading: false });
                } catch (err) {
                    set({ user: null, token: null, authLoading: false });
                    setAuthToken(null);
                }
            },

            // Data
            tickets: [],
            teams: [],
            users: [],
            teamMembers: [],
            notifications: [],
            loading: false,
            error: null,

            // Current team
            currentTeam: null,
            setCurrentTeam: (teamId) => set((state) => ({ currentTeam: state.teams.find(t => t.id === teamId) || state.teams[0] || null })),

            // Fetchers
            fetchTeams: async () => {
                set({ loading: true });
                try {
                    const res = await teamsAPI.getAll();
                    const teams = res.data.data.map(t => ({ ...t, id: t._id || t.id }));
                    set({ teams, loading: false });
                    if (!get().currentTeam && teams.length > 0) set({ currentTeam: teams[0] });
                } catch (err) {
                    console.error('fetchTeams error:', err);
                    // fallback to mock data for local dev preview
                    set({ teams: mockTeams, loading: false });
                    if (!get().currentTeam && mockTeams.length > 0) set({ currentTeam: mockTeams[0] });
                    set({ error: err.message || 'Failed to load teams, using mock data' });
                }
            },

            fetchUsers: async () => {
                set({ loading: true });
                try {
                    const res = await usersAPI.getAll();
                    const users = res.data.data.map(u => ({ ...u, id: u._id }));
                    set({ users, loading: false });
                } catch (err) {
                    console.error('fetchUsers error:', err);
                    set({ users: mockUsers, loading: false, error: err.message || 'Failed to load users, using mock data' });
                }
            },

            fetchTickets: async (params = {}) => {
                set({ loading: true });
                try {
                    const res = await ticketsAPI.getAll(params);
                    const payload = res.data.data || res.data;
                    const ticketsRaw = payload.tickets || payload;
                    const tickets = ticketsRaw.map(t => ({
                        id: t.ticketId || t._id,
                        title: t.title,
                        description: t.description,
                        priority: t.priority,
                        status: t.status,
                        category: t.category,
                        teamId: t.team?._id || t.team || null,
                        assignee: t.assignee ? { id: t.assignee._id, name: t.assignee.name, email: t.assignee.email, avatar: (t.assignee.name || '').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) } : null,
                        reporter: t.createdBy ? { id: t.createdBy._id, name: t.createdBy.name, email: t.createdBy.email } : null,
                        createdAt: t.createdAt,
                        updatedAt: t.updatedAt,
                        dueDate: t.dueDate,
                        aiConfidence: t.aiPredictions?.confidence || t.confidence || 0,
                        estimatedResolutionTime: t.estimatedTime || t.estimatedResolutionTime,
                        tags: t.tags || [],
                        comments: t.comments ? t.comments.length : (t.commentsCount || 0),
                        attachments: t.attachments ? t.attachments.length : (t.attachmentsCount || 0),
                        sentiment: t.sentiment,
                        customerTier: t.customerTier,
                        affectedUsers: t.affectedUsers,
                        similarTickets: t.similarTickets || [],
                    }));
                    set({ tickets, loading: false });
                    return { tickets, meta: { totalPages: payload.totalPages, currentPage: payload.currentPage, total: payload.total } };
                } catch (err) {
                    console.error('fetchTickets error:', err);
                    // fallback to mock tickets for dev preview
                    set({ tickets: mockTickets, loading: false, error: err.message || 'Failed to load tickets, using mock data' });
                    return { tickets: mockTickets, meta: { totalPages: 1, currentPage: 1, total: mockTickets.length } };
                }
            },

            createTicket: async (data) => {
                set({ loading: true });
                try {
                    const res = await ticketsAPI.create(data);
                    const t = res.data.data;
                    const ticket = {
                        id: t.ticketId || t._id,
                        title: t.title,
                        description: t.description,
                        priority: t.priority,
                        status: t.status,
                        category: t.category,
                        teamId: t.team?._id || t.team || null,
                        assignee: t.assignee ? { id: t.assignee._id, name: t.assignee.name, email: t.assignee.email } : null,
                        createdAt: t.createdAt,
                        updatedAt: t.updatedAt,
                        aiConfidence: t.aiPredictions?.confidence || t.confidence || 0,
                    };
                    set(state => ({ tickets: [ticket, ...state.tickets], loading: false }));
                    return ticket;
                } catch (err) { set({ error: err.message || 'Failed to create ticket', loading: false }); throw err; }
            },

            // Simple wrappers
            addTicketLocal: (ticket) => set((state) => ({ tickets: [ticket, ...state.tickets] })),
            updateTicketLocal: (id, updates) => set((state) => ({ tickets: state.tickets.map(t => t.id === id ? { ...t, ...updates } : t) })),
            deleteTicketLocal: (id) => set((state) => ({ tickets: state.tickets.filter(t => t.id !== id) })),

            // Selectors
            getTeamTickets: () => {
                const { tickets, currentTeam } = get();
                if (!currentTeam) return tickets;
                return tickets.filter(t => String(t.teamId) === String(currentTeam.id));
            },
            getTeamMembers: () => {
                const { users, currentTeam } = get();
                if (!currentTeam) return users;
                return users.filter(u => (u.team && String(u.team) === String(currentTeam.id)) || (currentTeam.members && currentTeam.members.find(m => String(m.user || m) === String(u.id))));
            },

        }),
        {
            name: 'ticket-app-storage',
            partialize: (state) => ({ currentTeam: state.currentTeam, token: state.token }),
        }
    )
);
