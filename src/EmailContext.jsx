import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_EMAILS } from './mockData';

const EmailContext = createContext();

// Check if we are running in Electron
const isElectron = window && window.process && window.process.type;
const ipcRenderer = isElectron ? window.require('electron').ipcRenderer : null;

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('emails');
    return saved ? JSON.parse(saved) : MOCK_EMAILS;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [isLoading, setIsLoading] = useState(false);

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

  const fetchGmailEmails = async () => {
    if (!ipcRenderer) return;
    setIsLoading(true);
    try {
      const gmailEmails = await ipcRenderer.invoke('gmail:fetch-emails');
      if (gmailEmails && gmailEmails.length > 0) {
        // Merge with existing emails, avoiding duplicates
        setEmails(prev => {
          const existingIds = new Set(prev.map(e => e.gmailId || e.id));
          const newEmails = gmailEmails.filter(e => !existingIds.has(e.gmailId));
          return [...newEmails, ...prev];
        });
      }
    } catch (error) {
      console.error('Failed to fetch Gmail emails:', error);
    } finally {
      setIsLoading(false);
    }
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
    <EmailContext.Provider value={{
      emails, theme, isLoading,
      toggleTheme, toggleImportance, markDone, markLater, moveToInbox, fetchGmailEmails
    }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmails = () => useContext(EmailContext);
