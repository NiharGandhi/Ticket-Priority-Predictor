import EmptyState from '../components/common/EmptyState';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
    return (
        <div>
            <EmptyState
                icon={SettingsIcon}
                title="Settings"
                description="Configure your application preferences, notifications, and integrations."
                type="info"
            />
        </div>
    );
}
