import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Clock, Archive, Mail, Sun, Moon, RefreshCw, Globe, User, X, Settings, Key, Shield } from 'lucide-react';
import { useEmails } from './EmailContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme, fetchGmailEmails, isLoading } = useEmails();
  const [showSettings, setShowSettings] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [credentials, setCredentials] = useState({ clientId: '', clientSecret: '' });

  const isElectron = typeof window !== 'undefined' && window.process && window.process.type;
  const ipcRenderer = isElectron ? window['require']('electron').ipcRenderer : null;

  useEffect(() => {
    if (ipcRenderer && showSettings) {
      ipcRenderer.invoke('gmail:get-credentials').then(creds => {
        setCredentials(creds);
      });
    }
  }, [showSettings, ipcRenderer]);

  const tabs = [
    { id: 'important', label: 'Important', icon: Star },
    { id: 'non-important', label: 'Others', icon: Mail },
    { id: 'done', label: 'Done', icon: CheckCircle },
    { id: 'later', label: 'Later', icon: Clock },
    { id: 'all', label: 'All', icon: Archive },
  ];

  const handleSaveCredentials = async () => {
    if (!ipcRenderer) return;
    try {
      await ipcRenderer.invoke('gmail:set-credentials', credentials);
      alert('Credentials saved successfully!');
    } catch (error) {
      console.error('Failed to save credentials:', error);
      alert('Failed to save credentials.');
    }
  };

  const handleAuthenticate = async () => {
    if (!ipcRenderer) {
      alert("Error: Not running in Electron or IPC is unavailable.");
      return;
    }

    setIsAuthenticating(true);
    try {
        await ipcRenderer.invoke('gmail:authenticate');
        fetchGmailEmails();
        setShowSettings(false);
    } catch (error) {
        console.error('Authentication failed:', error);
        alert('Authentication failed. If your browser didn\'t open automatically, please check your network or try again.');
    } finally {
        setIsAuthenticating(false);
    }
  };

  return (
    <div className="flex justify-center mt-4 px-4 z-20 relative">
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
                onClick={toggleTheme}
                className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
                aria-label="Toggle Theme"
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
                onClick={() => setShowSettings(!showSettings)}
                className={`w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-900/50 flex items-center justify-center text-purple-700 dark:text-purple-300 border-2 border-white dark:border-gray-800 ml-2 shadow-sm overflow-hidden transition-transform active:scale-95 ${showSettings ? 'ring-2 ring-purple-500' : ''}`}
                aria-label="Account Settings"
            >
                <User size={20} />
            </button>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-24 right-10 w-96 glass-effect bg-white/80 dark:bg-gray-900/80 rounded-3xl p-6 shadow-2xl z-50 border border-white/50 dark:border-white/10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 dark:text-purple-400">
                    <Settings size={20} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Gmail Settings</h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="clientId" className="text-sm font-semibold ml-1 flex items-center text-gray-600 dark:text-gray-400">
                    <Key size={14} className="mr-1" /> Client ID
                  </label>
                  <input
                    id="clientId"
                    type="text"
                    value={credentials.clientId}
                    onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
                    className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    placeholder="Enter Google Client ID"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="clientSecret" className="text-sm font-semibold ml-1 flex items-center text-gray-600 dark:text-gray-400">
                    <Shield size={14} className="mr-1" /> Client Secret
                  </label>
                  <input
                    id="clientSecret"
                    type="password"
                    value={credentials.clientSecret}
                    onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
                    className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    placeholder="Enter Google Client Secret"
                  />
                </div>

                <div className="pt-2 flex flex-col space-y-3">
                  <button
                    onClick={handleSaveCredentials}
                    className="w-full py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-white rounded-2xl font-bold transition-all text-sm"
                  >
                    Save Credentials
                  </button>

                  <div className="h-[1px] bg-gray-200 dark:bg-white/10 my-1" />

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
                    {isAuthenticating ? 'Connecting...' : 'Connect Gmail Account'}
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-100/50 dark:border-blue-900/30">
                <p className="text-[11px] text-blue-800/70 dark:text-blue-300/60 leading-relaxed italic">
                  Note: You'll need to create a Google Cloud Project and enable Gmail API to get these credentials. Redirect URI must be set to http://127.0.0.1:42813
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
