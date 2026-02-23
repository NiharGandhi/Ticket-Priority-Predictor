import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatRelativeTime } from '../../lib/utils';
import { mockTickets } from '../../data/mockData';

export default function RecentTicketsTable() {
    const navigate = useNavigate();
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const recentTickets = mockTickets.slice(0, 10);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <Card className="p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Recent Tickets
                </h3>
                <button
                    onClick={() => navigate('/tickets')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    View all â†’
                </button>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-dark-border">
                            <th
                                className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white"
                                onClick={() => handleSort('id')}
                            >
                                ID
                            </th>
                            <th
                                className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white"
                                onClick={() => handleSort('title')}
                            >
                                Title
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Assignee
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTickets.map((ticket) => (
                            <tr
                                key={ticket.id}
                                className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors cursor-pointer"
                                onClick={() => navigate(`/tickets/${ticket.id}`)}
                            >
                                <td className="py-3 px-4">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        #{ticket.id}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="text-sm text-gray-900 dark:text-white truncate max-w-xs block">
                                        {ticket.title}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <Badge type="priority" value={ticket.priority}>
                                        {ticket.priority}
                                    </Badge>
                                </td>
                                <td className="py-3 px-4">
                                    <Badge type="status" value={ticket.status}>
                                        {ticket.status}
                                    </Badge>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                            {ticket.assignee.avatar}
                                        </div>
                                        <span className="text-sm text-gray-900 dark:text-white">
                                            {ticket.assignee.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatRelativeTime(ticket.createdAt)}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-border rounded transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/tickets/${ticket.id}`);
                                            }}
                                        >
                                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </button>
                                        <button
                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-border rounded transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </button>
                                        <button
                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-border rounded transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Trash2 className="w-4 h-4 text-danger-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
