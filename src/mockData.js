export const MOCK_EMAILS = [
  {
    id: '1',
    from: 'Alice Smith',
    subject: 'Project Update',
    body: 'Hi, here is the update on the project. We are on track.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isImportant: true,
    status: 'inbox',
    dueDate: null,
  },
  {
    id: '2',
    from: 'Bob Johnson',
    subject: 'Lunch next week?',
    body: 'Are you free for lunch on Wednesday?',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isImportant: false,
    status: 'inbox',
    dueDate: null,
  },
  {
    id: '3',
    from: 'Newsletter',
    subject: 'Weekly Digest',
    body: 'Here are the top stories of the week.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isImportant: false,
    status: 'inbox',
    dueDate: null,
  },
  {
    id: '4',
    from: 'Boss',
    subject: 'Urgent Request',
    body: 'Please review this document as soon as possible.',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isImportant: true,
    status: 'inbox',
    dueDate: null,
  },
  {
    id: '5',
    from: 'Spammy',
    subject: 'You won a prize!',
    body: 'Click here to claim your prize.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    isImportant: false,
    status: 'inbox',
    dueDate: null,
  },
];
