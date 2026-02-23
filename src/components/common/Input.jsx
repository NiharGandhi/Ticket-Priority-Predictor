import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    className = '',
    icon: Icon,
    ...props
}) {
    const [focused, setFocused] = useState(false);
    const hasValue = value && value.length > 0;

    return (
        <div className={cn('relative', className)}>
            {label && (
                <label
                    className={cn(
                        'absolute left-3 transition-all duration-200 pointer-events-none',
                        focused || hasValue
                            ? '-top-2 text-xs bg-white dark:bg-dark-surface px-1 text-primary-600'
                            : 'top-2.5 text-sm text-gray-500'
                    )}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Icon className="w-4 h-4" />
                    </div>
                )}

                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={!label ? placeholder : ''}
                    className={cn(
                        'w-full px-4 py-2.5 border rounded-lg transition-all duration-200',
                        'focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none',
                        'bg-white dark:bg-dark-surface text-gray-900 dark:text-white',
                        Icon && 'pl-10',
                        error
                            ? 'border-danger-500 focus:ring-danger-500'
                            : 'border-gray-300 dark:border-dark-border',
                    )}
                    {...props}
                />
            </div>

            {error && (
                <p className="mt-1 text-xs text-danger-600">{error}</p>
            )}
        </div>
    );
}
