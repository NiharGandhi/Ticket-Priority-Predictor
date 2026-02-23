import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Clock, Calendar, User } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { mockTickets } from '../data/mockData';
import { formatDate } from '../lib/utils';

export default function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const ticket = mockTickets.find((t) => t.id === id);

    if (!ticket) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Ticket Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The ticket you're looking for doesn't exist.
                </p>
                <Button onClick={() => navigate('/tickets')}>
                    Back to Tickets
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/tickets')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Ticket #{ticket.id}
                        </h1>
                        <Badge type="status" value={ticket.status}>
                            {ticket.status}
                        </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Created {formatDate(ticket.createdAt)}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" icon={Edit}>
                        Edit
                    </Button>
                    <Button variant="danger" icon={Trash2}>
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-6">
                    
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            {ticket.title}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            {ticket.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-dark-border">
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                                    Category
                                </label>
                                <p className="text-sm text-gray-900 dark:text-white font-medium">
                                    {ticket.category}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                                    Estimated Resolution
                                </label>
                                <p className="text-sm text-gray-900 dark:text-white font-medium">
                                    {ticket.estimatedResolutionTime}
                                </p>
                            </div>
                        </div>
                    </Card>

                    
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Comments ({ticket.comments})
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                            No comments yet. Be the first to comment!
                        </p>
                    </Card>
                </div>

                
                <div className="space-y-6">
                    
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                    Priority
                                </label>
                                <Badge type="priority" value={ticket.priority} className="text-sm py-1.5">
                                    {ticket.priority}
                                </Badge>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                    Assignee
                                </label>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                                        {ticket.assignee.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {ticket.assignee.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {ticket.assignee.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                    Reporter
                                </label>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center text-white font-semibold">
                                        {ticket.reporter.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {ticket.reporter.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {ticket.reporter.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Due Date</span>
                                </label>
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {formatDate(ticket.dueDate)}
                                </p>
                            </div>
                        </div>
                    </Card>

                    
                    <Card className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-dark-surface dark:to-dark-border border-primary-200">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            AI Predictions
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                    Priority Confidence
                                </label>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-success rounded-full transition-all"
                                            style={{ width: `${ticket.aiConfidence}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-primary-600">
                                        {ticket.aiConfidence}%
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                    Suggested Resolution Time
                                </label>
                                <p className="text-sm text-gray-900 dark:text-white font-medium">
                                    {ticket.estimatedResolutionTime}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                    Recommended Priority
                                </label>
                                <Badge type="priority" value={ticket.priority}>
                                    {ticket.priority}
                                </Badge>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
