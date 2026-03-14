import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Breadcrumbs from '../common/Breadcrumbs';
import PageTransition from '../common/PageTransition';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import useTeamFilter from '../../hooks/useTeamFilter';

export default function Layout() {
    const { sidebarCollapsed, token, loadMe, fetchTeams, fetchUsers } = useStore();
    useTeamFilter();

    useEffect(() => {
        // If there's a token in localStorage, validate and load the user
        if (token) loadMe();
        // Load teams and users for the app
        fetchTeams();
        fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            <Sidebar />

            <div className={cn(
                'transition-all duration-300',
                sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-[280px]'
            )}>
                <Topbar />
                <Breadcrumbs />

                <main className="p-6">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </main>
            </div>
        </div>
    );
}
