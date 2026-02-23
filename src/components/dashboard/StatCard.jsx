import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../common/Card';
import { cn } from '../../lib/utils';

export default function StatCard({
    title,
    value,
    icon: Icon,
    gradient,
    trend,
    trendValue,
    delay = 0
}) {
    const [count, setCount] = useState(0);
    const targetValue = typeof value === 'string' ? parseInt(value) : value;
    useEffect(() => {
        if (isNaN(targetValue)) {
            setCount(value);
            return;
        }

        const duration = 1000;
        const steps = 60;
        const stepValue = targetValue / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            setCount(Math.min(Math.floor(stepValue * currentStep), targetValue));

            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [targetValue, value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card className="p-6 hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {title}
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 animate-count-up">
                            {typeof count === 'number' && !isNaN(count) ? count.toLocaleString() : count}
                        </h3>

                        {trend && (
                            <div className="flex items-center space-x-1">
                                {trend === 'up' ? (
                                    <TrendingUp className="w-4 h-4 text-success-600" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-danger-600" />
                                )}
                                <span className={cn(
                                    'text-sm font-medium',
                                    trend === 'up' ? 'text-success-600' : 'text-danger-600'
                                )}>
                                    {trendValue}
                                </span>
                                <span className="text-xs text-gray-500">vs last week</span>
                            </div>
                        )}
                    </div>

                    <div className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center',
                        gradient
                    )}>
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                </div>

                
                <div className={cn('h-1 mt-4 rounded-full', gradient)} />
            </Card>
        </motion.div>
    );
}
