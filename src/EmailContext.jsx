import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_EMAILS } from './mockData';

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('emails');
    return saved ? JSON.parse(saved) : MOCK_EMAILS;
  });

  useEffect(() => {
    localStorage.setItem('emails', JSON.stringify(emails));
  }, [emails]);

  const toggleImportance = (id) => {
    setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, isImportant: !email.isImportant } : email
    ));
  };

  const markDone = (id) => {
    setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, status: 'done' } : email
    ));
  };

  const markLater = (id, dueDate = null) => {
    setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, status: 'later', dueDate: dueDate } : email
    ));
  };

  const moveToInbox = (id) => {
      setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, status: 'inbox' } : email
    ));
  }

  return (
    <EmailContext.Provider value={{ emails, toggleImportance, markDone, markLater, moveToInbox }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmails = () => useContext(EmailContext);
