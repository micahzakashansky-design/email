import React, { useState } from 'react';
import Sidebar from './Sidebar';
import EmailList from './EmailList';
import EmailDetail from './EmailDetail';
import { useEmails, EmailProvider } from './EmailContext';

function EmailApp() {
  const { emails, toggleImportance, markDone, markLater, moveToInbox } = useEmails();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);

  const filteredEmails = emails.filter((email) => {
    switch (activeTab) {
      case 'inbox':
        return email.status === 'inbox';
      case 'important':
        return email.isImportant && email.status === 'inbox';
      case 'non-important':
        return !email.isImportant && email.status === 'inbox';
      case 'done':
        return email.status === 'done';
      case 'later':
        return email.status === 'later';
      case 'all':
        return email.status !== 'deleted'; // We haven't implemented delete, so just show all
      default:
        return true;
    }
  });

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  };

  // Find the actual email object in the state to ensure we have the latest data
  const currentEmail = selectedEmail ? emails.find(e => e.id === selectedEmail.id) : null;

  return (
    <div className="flex h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <EmailList
        emails={filteredEmails}
        onSelect={handleSelectEmail}
        selectedId={currentEmail?.id}
        onToggleImportance={toggleImportance}
        onMarkDone={markDone}
        onMarkLater={markLater}
        onMoveToInbox={moveToInbox}
      />
      <EmailDetail
        email={currentEmail}
        onToggleImportance={toggleImportance}
        onMarkDone={markDone}
        onMarkLater={markLater}
      />
    </div>
  );
}

function App() {
  return (
    <EmailProvider>
      <EmailApp />
    </EmailProvider>
  );
}

export default App;
