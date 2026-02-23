import { cn } from '../../lib/utils';

export default function LoadingSkeleton({ className = '', variant = 'text' }) {
    const variants = {
        text: 'h-4 w-full rounded',
        title: 'h-6 w-3/4 rounded',
        avatar: 'h-10 w-10 rounded-full',
        card: 'h-32 w-full rounded-xl',
        button: 'h-10 w-24 rounded-lg',
    };

    return (
        <div className={cn(
            'animate-pulse bg-gray-200 dark:bg-dark-border relative overflow-hidden',
            variants[variant],
            className
        )}>
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
    );
}
export function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-soft">
            <LoadingSkeleton variant="title" className="mb-4" />
            <LoadingSkeleton variant="text" className="mb-2" />
            <LoadingSkeleton variant="text" className="w-2/3" />
        </div>
    );
}
