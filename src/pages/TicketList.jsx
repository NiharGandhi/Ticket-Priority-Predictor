import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Layout, List, Plus } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { mockTickets } from '../data/mockData';
import { formatRelativeTime } from '../lib/utils';
import { motion } from 'framer-motion';

export default function TicketList() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPriority, setSelectedPriority] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const filteredTickets = mockTickets.filter((ticket) => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = selectedPriority.length === 0 || selectedPriority.includes(ticket.priority);
        const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(ticket.status);
        return matchesSearch && matchesPriority && matchesStatus;
    });

    const togglePriority = (priority) => {
        setSelectedPriority(prev =>
            prev.includes(priority)
                ? prev.filter(p => p !== priority)
                : [...prev, priority]
        );
    };

    const toggleStatus = (status) => {
        setSelectedStatus(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    return (
        <div className="space-y-6">
            
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        All Tickets
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {filteredTickets.length} tickets found
                    </p>
                </div>
                <Button icon={Plus} onClick={() => navigate('/create')}>
                    Create Ticket
                </Button>
            </div>

            
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    
                    <div className="md:col-span-2">
                        <Input
                            icon={Search}
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                    ? 'bg-primary-100 text-primary-600'
                                    : 'bg-gray-100 dark:bg-dark-border text-gray-600'
                                }`}
                        >
                            <Layout className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                    ? 'bg-primary-100 text-primary-600'
                                    : 'bg-gray-100 dark:bg-dark-border text-gray-600'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>

                    
                    <div>
                        <Button variant="outline" icon={Filter} className="w-full">
                            Filters
                        </Button>
                    </div>
                </div>

                
                <div className="mt-4 space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Priority
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['Critical', 'High', 'Medium', 'Low'].map((priority) => (
                                <button
                                    key={priority}
                                    onClick={() => togglePriority(priority)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedPriority.includes(priority)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                        }`}
                                >
                                    {priority}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Status
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => toggleStatus(status)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedStatus.includes(status)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTickets.map((ticket, index) => (
                        <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card
                                clickable
                                onClick={() => navigate(`/tickets/${ticket.id}`)}
                                className="p-5 h-full flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        #{ticket.id}
                                    </span>
                                    <Badge type="priority" value={ticket.priority}>
                                        {ticket.priority}
                                    </Badge>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                    {ticket.title}
                                </h3>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                                    {ticket.description}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-dark-border">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                            {ticket.assignee.avatar}
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {ticket.assignee.name}
                                        </span>
                                    </div>
                                    <Badge type="status" value={ticket.status}>
                                        {ticket.status}
                                    </Badge>
                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                    <span>{formatRelativeTime(ticket.createdAt)}</span>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-12 h-1.5 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-success rounded-full"
                                                style={{ width: `${ticket.aiConfidence}%` }}
                                            />
                                        </div>
                                        <span>{ticket.aiConfidence}%</span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <Card className="p-6">
                    <div className="space-y-3">
                        {filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => navigate(`/tickets/${ticket.id}`)}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-border/30 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border cursor-pointer transition-colors"
                            >
                                <div className="flex items-center space-x-4 flex-1">
                                    <span className="text-sm font-medium text-gray-500">#{ticket.id}</span>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1">{ticket.title}</h4>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs">
                                            {ticket.assignee.avatar}
                                        </div>
                                    </div>
                                    <Badge type="priority" value={ticket.priority}>{ticket.priority}</Badge>
                                    <Badge type="status" value={ticket.status}>{ticket.status}</Badge>
                                    <span className="text-xs text-gray-500">{formatRelativeTime(ticket.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
