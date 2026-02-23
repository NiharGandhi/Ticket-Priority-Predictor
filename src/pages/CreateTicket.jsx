import EmptyState from '../components/common/EmptyState';
import { Construction } from 'lucide-react';

export default function CreateTicket() {
    return (
        <div>
            <EmptyState
                icon={Construction}
                title="Create Ticket Form"
                description="This page is under construction. The ticket creation form with rich text editor, file upload, and AI-powered suggestions will be implemented here."
                type="info"
            />
        </div>
    );
}
