import EmptyState from '../components/common/EmptyState';
import { Users } from 'lucide-react';

export default function Team() {
    return (
        <div>
            <EmptyState
                icon={Users}
                title="Team Management"
                description="View and manage your team members, roles, and permissions."
                type="info"
            />
        </div>
    );
}
