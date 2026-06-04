import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_EMAILS } from './mockData';

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('emails');
    return saved ? JSON.parse(saved) : MOCK_EMAILS;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('emails', JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleImportance = (id) => {
    setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, isImportant: !email.isImportant } : email
    ));
  };

  const markDone = (id) => {
    setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, status: 'done', dueDate: null } : email
    ));
  };

  const markLater = (id, dueDate = null) => {
    setEmails(prev => prev.map(email => {
      if (email.id === id) {
        // If we're providing a date, update it.
        // If we're just moving to later, don't clear existing date if it has one.
        return {
          ...email,
          status: 'later',
          dueDate: dueDate !== null ? dueDate : email.dueDate
        };
      }
      return email;
    }));
  };

  const moveToInbox = (id) => {
      setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, status: 'inbox', dueDate: null } : email
    ));
  }

  return (
    <EmailContext.Provider value={{ emails, theme, toggleTheme, toggleImportance, markDone, markLater, moveToInbox }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmails = () => useContext(EmailContext);
