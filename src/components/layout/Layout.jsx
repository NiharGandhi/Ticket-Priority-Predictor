import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export default function Layout() {
    const { sidebarCollapsed } = useStore();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            <Sidebar />

            <div className={cn(
                'transition-all duration-300',
                sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-[280px]'
            )}>
                <Topbar />

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
