import React, { useState } from 'react';
import Header from './Header';
import EmailList from './EmailList';
import EmailDetail from './EmailDetail';
import { useEmails, EmailProvider } from './EmailContext';
import { AnimatePresence, motion } from 'framer-motion';

function EmailApp() {
  const { emails, toggleImportance, markDone, markLater, moveToInbox, theme } = useEmails();
  const [activeTab, setActiveTab] = useState('important');
  const [selectedEmail, setSelectedEmail] = useState(null);

  const filteredEmails = emails.filter((email) => {
    switch (activeTab) {
      case 'important':
        return email.isImportant && email.status === 'inbox';
      case 'non-important':
        return !email.isImportant && email.status === 'inbox';
      case 'done':
        return email.status === 'done';
      case 'later':
        return email.status === 'later';
      case 'all':
        return email.status !== 'deleted';
      default:
        return true;
    }
  });

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
  };

  const currentEmail = selectedEmail ? emails.find(e => e.id === selectedEmail.id) : null;

  return (
    <div className={`flex flex-col h-screen transition-colors duration-500 overflow-hidden`}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex flex-1 overflow-hidden">
        <EmailList
          emails={filteredEmails}
          onSelect={handleSelectEmail}
          selectedId={currentEmail?.id}
          onToggleImportance={toggleImportance}
          onMarkDone={markDone}
          onMarkLater={markLater}
          onMoveToInbox={moveToInbox}
        />

        <AnimatePresence mode="wait">
          <EmailDetail
            key={currentEmail?.id || 'empty'}
            email={currentEmail}
            onToggleImportance={toggleImportance}
            onMarkDone={markDone}
            onMarkLater={markLater}
          />
        </AnimatePresence>
      </main>
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
