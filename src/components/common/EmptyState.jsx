import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    actionLabel,
    type = 'info'
}) {
    const icons = {
        info: Info,
        success: CheckCircle2,
        warning: AlertTriangle,
        error: AlertCircle,
    };

    const colors = {
        info: 'text-primary-500',
        success: 'text-success-500',
        warning: 'text-warning-500',
        error: 'text-danger-500',
    };

    const DisplayIcon = Icon || icons[type];

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className={cn(
                'w-16 h-16 mb-4 rounded-full flex items-center justify-center',
                'bg-gray-100 dark:bg-dark-border'
            )}>
                <DisplayIcon className={cn('w-8 h-8', colors[type])} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                    {description}
                </p>
            )}
            {action && actionLabel && (
                <button
                    onClick={action}
                    className="px-6 py-2.5 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-colored-primary transition-all"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
