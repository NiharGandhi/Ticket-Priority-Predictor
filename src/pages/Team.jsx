import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Edit, Trash2, Star, Clock, CheckCircle, Ticket, Mail, Shield, Wifi, WifiOff, X } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

const roleColors = {
    'Team Lead': 'bg-purple-100 text-purple-700 border-purple-200',
    'Senior Agent': 'bg-primary-100 text-primary-700 border-primary-200',
    'Support Agent': 'bg-secondary-100 text-secondary-700 border-secondary-200',
    'QA Specialist': 'bg-warning-100 text-warning-700 border-warning-200',
    'Admin': 'bg-danger-100 text-danger-700 border-danger-200',
};

const statusIcons = {
    'online': { icon: Wifi, color: 'text-success-500', label: 'Online' },
    'away': { icon: WifiOff, color: 'text-warning-500', label: 'Away' },
    'offline': { icon: WifiOff, color: 'text-gray-400', label: 'Offline' },
};

export default function Team() {
    const { teamMembers, addTeamMember, updateTeamMember, removeTeamMember } = useStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [editMember, setEditMember] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Support Agent', expertise: '' });

    const workloadData = teamMembers.map(m => ({
        name: m.name.split(' ')[0],
        current: m.currentTickets,
        resolved: m.resolvedToday,
    }));

    const handleSave = () => {
        if (!formData.name || !formData.email) { toast.error('Name and email are required'); return; }
        if (editMember) {
            updateTeamMember(editMember.id, { ...formData, expertise: formData.expertise.split(',').map(e => e.trim()).filter(Boolean) });
            toast.success('Team member updated');
        } else {
            addTeamMember({
                id: `user-${Date.now()}`, ...formData, avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
                expertise: formData.expertise.split(',').map(e => e.trim()).filter(Boolean),
                currentTickets: 0, resolvedToday: 0, resolvedThisWeek: 0, avgResolutionTime: 0, satisfaction: 0, status: 'online',
            });
            toast.success('Team member added');
        }
        setModalOpen(false);
        setEditMember(null);
        setFormData({ name: '', email: '', role: 'Support Agent', expertise: '' });
    };

    const handleEdit = (member) => {
        setEditMember(member);
        setFormData({ name: member.name, email: member.email, role: member.role, expertise: member.expertise.join(', ') });
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        removeTeamMember(id);
        toast.success('Team member removed');
    };

    const totalResolved = teamMembers.reduce((s, m) => s + m.resolvedToday, 0);
    const avgSatisfaction = (teamMembers.reduce((s, m) => s + m.satisfaction, 0) / teamMembers.length).toFixed(1);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Team Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">{teamMembers.length} team members</p>
                </div>
                <Button icon={Plus} onClick={() => { setEditMember(null); setFormData({ name: '', email: '', role: 'Support Agent', expertise: '' }); setModalOpen(true); }}>
                    Add Member
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Members', value: teamMembers.length, icon: Shield, gradient: 'bg-gradient-primary' },
                    { label: 'Resolved Today', value: totalResolved, icon: CheckCircle, gradient: 'bg-gradient-success' },
                    { label: 'Avg Satisfaction', value: `${avgSatisfaction}/5`, icon: Star, gradient: 'bg-gradient-warning' },
                ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                                </div>
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.gradient)}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Workload Chart */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Workload Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={workloadData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                        <Bar dataKey="current" fill="#667eea" radius={[6, 6, 0, 0]} name="Current Tickets" />
                        <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} name="Resolved Today" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Team Member Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => {
                    const statusInfo = statusIcons[member.status] || statusIcons.offline;
                    return (
                        <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                            <Card className="p-6 hover:shadow-strong transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {member.avatar}
                                            </div>
                                            <div className={cn('absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-dark-surface',
                                                member.status === 'online' ? 'bg-success-500' : member.status === 'away' ? 'bg-warning-500' : 'bg-gray-400'
                                            )} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(member)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">
                                            <Edit className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button onClick={() => handleDelete(member.id)} className="p-1.5 hover:bg-danger-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4 text-danger-500" />
                                        </button>
                                    </div>
                                </div>

                                <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', roleColors[member.role] || 'bg-gray-100 text-gray-700 border-gray-200')}>
                                    {member.role}
                                </span>

                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {member.expertise.map(exp => (
                                        <span key={exp} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400 rounded-md">{exp}</span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                                    <div className="flex items-center space-x-2">
                                        <Ticket className="w-4 h-4 text-primary-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Active</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{member.currentTickets}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-success-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Resolved</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{member.resolvedToday}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-secondary-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Avg Time</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{member.avgResolutionTime}h</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Star className="w-4 h-4 text-warning-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Rating</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{member.satisfaction}/5</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditMember(null); }} title={editMember ? 'Edit Team Member' : 'Add Team Member'}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" placeholder="Full name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                        <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" placeholder="email@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                            {['Team Lead', 'Senior Agent', 'Support Agent', 'QA Specialist', 'Admin'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expertise</label>
                        <input value={formData.expertise} onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" placeholder="e.g. Security, API, Backend (comma-separated)" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="ghost" onClick={() => { setModalOpen(false); setEditMember(null); }}>Cancel</Button>
                        <Button onClick={handleSave}>{editMember ? 'Update' : 'Add Member'}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
