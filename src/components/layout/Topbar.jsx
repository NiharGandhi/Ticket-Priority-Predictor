import { useState, useEffect } from 'react';
import { Search, Bell, Menu, Moon, Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Topbar() {
    const { toggleSidebar, darkMode, toggleDarkMode } = useStore();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchFocused, setSearchFocused] = useState(false);
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <header className="h-16 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border sticky top-0 z-30">
            <div className="h-full flex items-center justify-between px-6">
                
                <div className="flex items-center space-x-4">
                    
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                    >
                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>

                    
                    <div className="relative">
                        <div className={cn(
                            'flex items-center transition-all duration-300',
                            searchFocused ? 'w-64 md:w-96' : 'w-64'
                        )}>
                            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={cn(
                                    'w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg',
                                    'bg-gray-50 dark:bg-dark-bg focus:bg-white dark:focus:bg-dark-surface',
                                    'text-gray-900 dark:text-white placeholder-gray-500',
                                    'focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none',
                                    'transition-all duration-200'
                                )}
                            />
                        </div>
                    </div>
                </div>

                
                <div className="flex items-center space-x-4">
                    
                    <div className="hidden md:block text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(currentTime)}
                        </div>
                    </div>

                    
                    <button
                        onClick={toggleDarkMode}
                        className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: darkMode ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {darkMode ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-600" />
                            )}
                        </motion.div>
                    </button>

                    
                    <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full animate-pulse" />
                    </button>

                    
                    <div className="flex items-center space-x-3 cursor-pointer group">
                        <div className="hidden md:block text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                John Doe
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Developer
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-transparent group-hover:ring-primary-300 transition-all">
                            JD
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
