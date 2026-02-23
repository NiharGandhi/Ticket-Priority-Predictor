const generateTickets = () => {
    const titles = [
        'Login page not responding',
        'Database connection timeout',
        'Payment gateway integration error',
        'Email notification system down',
        'User profile image upload failing',
        'Search feature returning incorrect results',
        'API rate limiting too aggressive',
        'Mobile app crashing on startup',
        'Report generation taking too long',
        'Dashboard charts not loading',
        'Unable to reset password',
        'File download not working',
        'Session timeout too short',
        'Dark mode toggle broken',
        'Notification bell not showing count',
        'CSV export missing columns',
        'Sidebar navigation stuck',
        'Form validation errors unclear',
        'Page load time very slow',
        'Memory leak in analytics page',
    ];

    const descriptions = [
        'Users are experiencing issues when trying to access this feature.',
        'The system is throwing an error when performing this operation.',
        'This functionality needs immediate attention as it affects multiple users.',
        'The performance is degraded and needs optimization.',
        'We need to investigate why this is happening in production.',
    ];

    const priorities = ['Critical', 'High', 'Medium', 'Low'];
    const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    const categories = ['Bug', 'Feature', 'Enhancement', 'Support', 'Security'];
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
        { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', avatar: 'SS' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', avatar: 'ED' },
        { id: 5, name: 'David Wilson', email: 'david@example.com', avatar: 'DW' },
    ];

    const tickets = [];
    for (let i = 0; i < 50; i++) {
        const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        tickets.push({
            id: String(1000 + i),
            title: titles[i % titles.length] + (i >= titles.length ? ` (${Math.floor(i / titles.length) + 1})` : ''),
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            priority,
            status,
            category: categories[Math.floor(Math.random() * categories.length)],
            assignee: users[Math.floor(Math.random() * users.length)],
            reporter: users[Math.floor(Math.random() * users.length)],
            createdAt: createdDate.toISOString(),
            updatedAt: new Date(createdDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
            dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
            aiConfidence: Math.floor(Math.random() * 30) + 70,
            estimatedResolutionTime: `${Math.floor(Math.random() * 48) + 1}h`,
            tags: ['bug', 'urgent'].slice(0, Math.floor(Math.random() * 2) + 1),
            comments: Math.floor(Math.random() * 10),
            attachments: Math.floor(Math.random() * 5),
        });
    }

    return tickets;
};

export const mockTickets = generateTickets();

export const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD', role: 'Developer' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', avatar: 'SS', role: 'Designer' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ', role: 'Manager' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', avatar: 'ED', role: 'QA Engineer' },
    { id: 5, name: 'David Wilson', email: 'david@example.com', avatar: 'DW', role: 'Product Owner' },
];

export const mockComments = [
    {
        id: 1,
        ticketId: '1000',
        user: mockUsers[0],
        content: 'I\'ve started investigating this issue. Will update soon.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        ticketId: '1000',
        user: mockUsers[1],
        content: 'This seems to be affecting multiple users. Priority should be higher.',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
];

export const mockActivities = [
    {
        id: 1,
        type: 'created',
        user: mockUsers[0],
        message: 'created ticket #1025',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        type: 'updated',
        user: mockUsers[1],
        message: 'changed priority from Medium to High on #1023',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        type: 'commented',
        user: mockUsers[2],
        message: 'commented on ticket #1020',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        type: 'resolved',
        user: mockUsers[3],
        message: 'resolved ticket #1018',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        type: 'assigned',
        user: mockUsers[4],
        message: 'assigned ticket #1022 to Mike Johnson',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    },
];
export const mockAnalyticsData = {
    ticketsOverTime: [
        { date: '2024-01-15', open: 12, resolved: 8, total: 20 },
        { date: '2024-01-16', open: 15, resolved: 10, total: 25 },
        { date: '2024-01-17', open: 18, resolved: 12, total: 30 },
        { date: '2024-01-18', open: 14, resolved: 16, total: 30 },
        { date: '2024-01-19', open: 20, resolved: 14, total: 34 },
        { date: '2024-01-20', open: 16, resolved: 18, total: 34 },
        { date: '2024-01-21', open: 22, resolved: 15, total: 37 },
    ],
    ticketsByCategory: [
        { category: 'Bug', count: 120 },
        { category: 'Feature', count: 85 },
        { category: 'Enhancement', count: 62 },
        { category: 'Support', count: 45 },
        { category: 'Security', count: 28 },
    ],
    priorityDistribution: [
        { name: 'Critical', value: 15, color: '#dc2626' },
        { name: 'High', value: 28, color: '#ea580c' },
        { name: 'Medium', value: 35, color: '#eab308' },
        { name: 'Low', value: 22, color: '#22c55e' },
    ],
};
