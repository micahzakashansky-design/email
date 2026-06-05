import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Clock, Archive, Mail, Sun, Moon, RefreshCw, Settings, X, Globe, User } from 'lucide-react';
import { useEmails } from './EmailContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme, fetchGmailEmails, isLoading } = useEmails();
  const [showSettings, setShowSettings] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [credentials, setCredentials] = useState({ clientId: '', clientSecret: '' });

  const isElectron = window && window.process && window.process.type;
  const ipcRenderer = isElectron ? window.require('electron').ipcRenderer : null;

  useEffect(() => {
    async function loadCredentials() {
      if (ipcRenderer) {
        const savedCreds = await ipcRenderer.invoke('gmail:get-credentials');
        if (savedCreds) {
          setCredentials(savedCreds);
        }
      }
    }
    if (showSettings) {
      loadCredentials();
    }
  }, [showSettings]);

  const tabs = [
    { id: 'important', label: 'Important', icon: Star },
    { id: 'non-important', label: 'Others', icon: Mail },
    { id: 'done', label: 'Done', icon: CheckCircle },
    { id: 'later', label: 'Later', icon: Clock },
    { id: 'all', label: 'All', icon: Archive },
  ];

  const handleSaveCredentials = async () => {
    if (ipcRenderer) {
      await ipcRenderer.invoke('gmail:set-credentials', credentials);
    }
  };

  const handleAuthenticate = async () => {
    if (!ipcRenderer) return;
    if (!credentials.clientId || !credentials.clientSecret) {
        alert('Please provide Client ID and Client Secret first.');
        return;
    }
    setIsAuthenticating(true);
    await handleSaveCredentials();
    try {
        await ipcRenderer.invoke('gmail:authenticate');
        setShowSettings(false);
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
                className={`flex flex-col items-center justify-center w-24 py-2 transition-all relative group rounded-full ${
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
                onClick={() => setShowSettings(!showSettings)}
                className={`p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${showSettings ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                title="Settings"
            >
                <Settings size={20} />
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

        <AnimatePresence>
            {showSettings && (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 20 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute top-full right-0 mt-3 p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl z-30 w-80 text-gray-800 dark:text-gray-100"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Gmail Setup</h3>
                    <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold mb-1 opacity-60 uppercase">Client ID</label>
                        <input
                            type="text"
                            placeholder="Google Client ID"
                            value={credentials.clientId}
                            onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-1 opacity-60 uppercase">Client Secret</label>
                        <input
                            type="password"
                            placeholder="Google Client Secret"
                            value={credentials.clientSecret}
                            onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        />
                    </div>

                    <div className="pt-2">
                        <p className="text-xs mb-3 text-gray-500 dark:text-gray-400">
                            Desktop App credentials required. Automated loopback flow enabled.
                        </p>
                        <button
                            onClick={handleAuthenticate}
                            disabled={isAuthenticating}
                            className={`w-full py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 text-sm flex items-center justify-center ${isAuthenticating ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isAuthenticating ? (
                                <RefreshCw size={18} className="mr-2 animate-spin" />
                            ) : (
                                <Globe size={18} className="mr-2" />
                            )}
                            {isAuthenticating ? 'Connecting...' : 'Connect Account'}
                        </button>
                    </div>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Header;
