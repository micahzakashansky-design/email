import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Clock, Archive, Mail, Sun, Moon, RefreshCw, Globe, User } from 'lucide-react';
import { useEmails } from './EmailContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme, fetchGmailEmails, isLoading } = useEmails();
  const [showSettings, setShowSettings] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [credentials, setCredentials] = useState({ clientId: '', clientSecret: '' });

  const isElectron = window && window.process && window.process.type;
  const ipcRenderer = isElectron ? window.require('electron').ipcRenderer : null;


  const tabs = [
    { id: 'important', label: 'Important', icon: Star },
    { id: 'non-important', label: 'Others', icon: Mail },
    { id: 'done', label: 'Done', icon: CheckCircle },
    { id: 'later', label: 'Later', icon: Clock },
    { id: 'all', label: 'All', icon: Archive },
  ];


  const handleAuthenticate = async () => {
    if (!ipcRenderer) return;

    setIsAuthenticating(true);
    try {
        await ipcRenderer.invoke('gmail:authenticate');
        fetchGmailEmails();
    } catch (error) {
        console.error('Authentication failed:', error);
        alert('Authentication failed. If your browser didn\'t open automatically, please check your network or try again.');
    } finally {
        setIsAuthenticating(false);
    }
  };

  return (
    <div className="flex justify-center mt-4 px-4 z-20">
      <div className="glass-effect rounded-full flex items-center px-2 py-1 shadow-2xl relative text-gray-800 dark:text-gray-100 max-w-fit border border-white/40 dark:border-white/10">
        <nav className="flex items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center px-6 py-2 transition-all relative group rounded-full ${
                  isActive
                    ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`mb-1 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                    {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2" />

        <div className="flex items-center space-x-1 px-2">
            <button
                onClick={fetchGmailEmails}
                disabled={isLoading}
                className={`p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`}
                title="Refresh Gmail"
            >
                <RefreshCw size={20} />
            </button>

            <button
                onClick={handleAuthenticate}
                disabled={isAuthenticating}
                className={`px-4 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 text-xs flex items-center justify-center ${isAuthenticating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isAuthenticating ? (
                    <RefreshCw size={14} className="mr-2 animate-spin" />
                ) : (
                    <Globe size={14} className="mr-2" />
                )}
                {isAuthenticating ? 'Connecting...' : 'Connect Gmail'}
            </button>


            <button
                onClick={toggleTheme}
                className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-900/50 flex items-center justify-center text-purple-700 dark:text-purple-300 border-2 border-white dark:border-gray-800 ml-2 shadow-sm overflow-hidden">
                <User size={20} />
            </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
