import { cn, getPriorityColor, getStatusColor } from '../../lib/utils';
import { X } from 'lucide-react';

export default function Badge({
    children,
    variant = 'default',
    type = null,
    value = null,
    dismissible = false,
    onDismiss,
    className = ''
}) {
    let colorClasses = '';

    if (type === 'priority' && value) {
        colorClasses = getPriorityColor(value);
    } else if (type === 'status' && value) {
        colorClasses = getStatusColor(value);
    } else {
        const variants = {
            default: 'bg-gray-100 text-gray-700 border-gray-200',
            primary: 'bg-primary-100 text-primary-700 border-primary-200',
            success: 'bg-success-100 text-success-700 border-success-200',
            warning: 'bg-warning-100 text-warning-700 border-warning-200',
            danger: 'bg-danger-100 text-danger-700 border-danger-200',
        };
        colorClasses = variants[variant];
    }

    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
            colorClasses,
            className
        )}>
            {children}
            {dismissible && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDismiss?.();
                    }}
                    className="ml-1 -mr-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </span>
    );
}
