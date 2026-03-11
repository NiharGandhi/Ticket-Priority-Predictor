import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Cog, Link2, Palette, Save, Camera, Eye, EyeOff, Key, Mail, MessageSquare, Smartphone, Slack, Globe, Shield, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Cog },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'appearance', label: 'Appearance', icon: Palette },
];

function Toggle({ enabled, onChange, label, description }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
            </div>
            <button onClick={() => onChange(!enabled)} className={cn('relative w-11 h-6 rounded-full transition-colors', enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-border')}>
                <motion.div animate={{ x: enabled ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
        </div>
    );
}

export default function Settings() {
    const { settings, updateSettings, darkMode, toggleDarkMode } = useStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [profileForm, setProfileForm] = useState({ ...settings.profile, password: '', newPassword: '' });

    const handleSave = () => {
        if (activeTab === 'profile') {
            updateSettings('profile', { name: profileForm.name, email: profileForm.email, role: profileForm.role });
        }
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your account and application preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Tab Nav */}
                <Card className="p-3 lg:col-span-1 h-fit">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={cn('flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left transition-all', activeTab === tab.id ? 'bg-gradient-primary text-white shadow-colored-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border')}>
                                <tab.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </Card>

                {/* Content */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            {activeTab === 'profile' && (
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                                    <div className="flex items-center space-x-6 mb-8">
                                        <div className="relative">
                                            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                                {profileForm.avatar || 'JD'}
                                            </div>
                                            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                                                <Camera className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profileForm.name}</p>
                                            <p className="text-sm text-gray-500">{profileForm.role}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                            <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                            <input value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                            <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                            <input type="password" placeholder="••••••••"
                                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-dark-border">
                                        <Button icon={Save} onClick={handleSave}>Save Changes</Button>
                                    </div>
                                </Card>
                            )}

                            {activeTab === 'notifications' && (
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email Notifications</h3>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-dark-border/30 rounded-xl px-4 divide-y divide-gray-200 dark:divide-dark-border">
                                                <Toggle label="Ticket Created" description="When a new ticket is assigned to you" enabled={settings.notifications.emailTicketCreated}
                                                    onChange={(v) => updateSettings('notifications', { emailTicketCreated: v })} />
                                                <Toggle label="Ticket Updated" description="When a ticket you're watching is updated" enabled={settings.notifications.emailTicketUpdated}
                                                    onChange={(v) => updateSettings('notifications', { emailTicketUpdated: v })} />
                                                <Toggle label="Ticket Resolved" description="When a ticket is resolved" enabled={settings.notifications.emailTicketResolved}
                                                    onChange={(v) => updateSettings('notifications', { emailTicketResolved: v })} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Smartphone className="w-4 h-4 text-gray-500" />
                                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Push Notifications</h3>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-dark-border/30 rounded-xl px-4 divide-y divide-gray-200 dark:divide-dark-border">
                                                <Toggle label="Ticket Created" enabled={settings.notifications.pushTicketCreated}
                                                    onChange={(v) => updateSettings('notifications', { pushTicketCreated: v })} />
                                                <Toggle label="Ticket Updated" enabled={settings.notifications.pushTicketUpdated}
                                                    onChange={(v) => updateSettings('notifications', { pushTicketUpdated: v })} />
                                                <Toggle label="Ticket Resolved" enabled={settings.notifications.pushTicketResolved}
                                                    onChange={(v) => updateSettings('notifications', { pushTicketResolved: v })} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <MessageSquare className="w-4 h-4 text-gray-500" />
                                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">In-App</h3>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-dark-border/30 rounded-xl px-4">
                                                <Toggle label="All In-App Notifications" description="Show notifications within the application" enabled={settings.notifications.inAppAll}
                                                    onChange={(v) => updateSettings('notifications', { inAppAll: v })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-dark-border mt-6">
                                        <Button icon={Save} onClick={handleSave}>Save Preferences</Button>
                                    </div>
                                </Card>
                            )}

                            {activeTab === 'system' && (
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">System Settings</h2>
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 dark:bg-dark-border/30 rounded-xl px-4 divide-y divide-gray-200 dark:divide-dark-border">
                                            <Toggle label="Auto-Assignment" description="Automatically assign tickets based on team workload" enabled={settings.system.autoAssign}
                                                onChange={(v) => updateSettings('system', { autoAssign: v })} />
                                            <Toggle label="SLA Monitoring" description="Track and alert on SLA breaches" enabled={settings.system.slaEnabled}
                                                onChange={(v) => updateSettings('system', { slaEnabled: v })} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
                                                <Clock className="w-4 h-4 text-gray-500" /><span>SLA Rules (hours)</span>
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[
                                                    { label: 'Critical', key: 'slaCritical', color: 'border-danger-300 focus:ring-danger-500' },
                                                    { label: 'High', key: 'slaHigh', color: 'border-orange-300 focus:ring-orange-500' },
                                                    { label: 'Medium', key: 'slaMedium', color: 'border-warning-300 focus:ring-warning-500' },
                                                    { label: 'Low', key: 'slaLow', color: 'border-success-300 focus:ring-success-500' },
                                                ].map(sla => (
                                                    <div key={sla.key}>
                                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{sla.label}</label>
                                                        <input type="number" value={settings.system[sla.key]}
                                                            onChange={e => updateSettings('system', { [sla.key]: parseInt(e.target.value) || 0 })}
                                                            className={cn('w-full px-3 py-2 border rounded-xl bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:border-transparent outline-none text-sm', sla.color)} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-dark-border mt-6">
                                        <Button icon={Save} onClick={handleSave}>Save System Settings</Button>
                                    </div>
                                </Card>
                            )}

                            {activeTab === 'integrations' && (
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Integrations</h2>
                                    <div className="space-y-4">
                                        {[
                                            { name: 'Slack', description: 'Get ticket notifications in your Slack channels', icon: '💬', connected: settings.integrations.slack, key: 'slack' },
                                            { name: 'Email', description: 'Forward ticket updates to email', icon: '📧', connected: settings.integrations.email, key: 'email' },
                                            { name: 'API Access', description: 'Generate and manage API keys', icon: '🔑', connected: settings.integrations.apiKeyGenerated, key: 'apiKeyGenerated' },
                                        ].map(integration => (
                                            <div key={integration.key} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-dark-border/30 rounded-xl border border-gray-200 dark:border-dark-border">
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-3xl">{integration.icon}</span>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{integration.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{integration.description}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant={integration.connected ? 'ghost' : 'primary'}
                                                    size="sm"
                                                    onClick={() => { updateSettings('integrations', { [integration.key]: !integration.connected }); toast.success(integration.connected ? `${integration.name} disconnected` : `${integration.name} connected`); }}
                                                >
                                                    {integration.connected ? 'Disconnect' : 'Connect'}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {activeTab === 'appearance' && (
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 dark:bg-dark-border/30 rounded-xl px-4">
                                            <Toggle label="Dark Mode" description="Switch between light and dark themes" enabled={darkMode} onChange={toggleDarkMode} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Color Theme</h3>
                                            <div className="flex space-x-3">
                                                {[
                                                    { name: 'Purple', colors: ['#667eea', '#764ba2'] },
                                                    { name: 'Blue', colors: ['#3b82f6', '#1d4ed8'] },
                                                    { name: 'Green', colors: ['#10b981', '#059669'] },
                                                    { name: 'Orange', colors: ['#f59e0b', '#d97706'] },
                                                    { name: 'Pink', colors: ['#ec4899', '#be185d'] },
                                                ].map(theme => (
                                                    <button key={theme.name} className="group flex flex-col items-center space-y-1.5" title={theme.name}>
                                                        <div className="w-10 h-10 rounded-xl shadow-md ring-2 ring-transparent group-hover:ring-gray-300 transition-all"
                                                            style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }} />
                                                        <span className="text-xs text-gray-500">{theme.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function AnimatePresenceWrapper({ children }) {
    return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
