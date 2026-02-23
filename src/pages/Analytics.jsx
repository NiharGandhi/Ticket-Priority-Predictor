import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/common/Card';
import { mockAnalyticsData } from '../data/mockData';

export default function Analytics() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Insights and metrics about your ticket system
                </p>
            </div>

            
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    Tickets Over Time (Last 7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockAnalyticsData.ticketsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="open"
                            stroke="#667eea"
                            strokeWidth={2}
                            dot={{ fill: '#667eea', r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="resolved"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            dot={{ fill: '#06b6d4', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    Tickets by Category
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockAnalyticsData.ticketsByCategory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="category" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <Bar dataKey="count" fill="#667eea" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
