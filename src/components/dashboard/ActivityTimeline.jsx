import { motion } from 'framer-motion';
import { MessageCircle, User, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import Card from '../common/Card';
import { formatRelativeTime } from '../../lib/utils';
import { mockActivities } from '../../data/mockData';
import { cn } from '../../lib/utils';

export default function ActivityTimeline() {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'created':
                return { icon: AlertCircle, color: 'bg-primary-500' };
            case 'updated':
                return { icon: Edit, color: 'bg-secondary-500' };
            case 'commented':
                return { icon: MessageCircle, color: 'bg-warning-500' };
            case 'resolved':
                return { icon: CheckCircle, color: 'bg-success-500' };
            case 'assigned':
                return { icon: User, color: 'bg-purple-500' };
            default:
                return { icon: AlertCircle, color: 'bg-gray-500' };
        }
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Recent Activity
            </h3>

            <div className="relative space-y-6">
                
                <div className="absolute left-5 top-2 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-border" />

                {mockActivities.map((activity, index) => {
                    const { icon: Icon, color } = getActivityIcon(activity.type);

                    return (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="relative flex items-start space-x-4"
                        >
                            
                            <div className={cn(
                                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center',
                                color
                            )}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>

                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                        {activity.user.avatar}
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {activity.user.name}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {activity.message}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                    {formatRelativeTime(activity.timestamp)}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <button className="w-full mt-6 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium hover:bg-primary-50 dark:hover:bg-dark-border rounded-lg transition-colors">
                Load more activities
            </button>
        </Card>
    );
}
