import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Clock, Archive, Mail, Sun, Moon, RefreshCw, Settings, X } from 'lucide-react';
import { useEmails } from './EmailContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme, fetchGmailEmails, isLoading } = useEmails();
  const [showSettings, setShowSettings] = useState(false);
  const [authCode, setAuthCode] = useState('');
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
    { id: 'non-important', label: 'Non-important', icon: Mail },
    { id: 'done', label: 'Done', icon: CheckCircle },
    { id: 'later', label: 'Do Later', icon: Clock },
    { id: 'all', label: 'All Mail', icon: Archive },
  ];

  const handleSaveCredentials = async () => {
    if (ipcRenderer) {
      await ipcRenderer.invoke('gmail:set-credentials', credentials);
    }
  };

  const handleConnectGmail = async () => {
    if (!ipcRenderer) return;
    await handleSaveCredentials();
    const url = await ipcRenderer.invoke('gmail:get-auth-url');
    if (url) {
      window.require('electron').shell.openExternal(url);
    } else {
      alert('Please provide valid Client ID and Client Secret');
    }
  };

  const handleSetToken = async () => {
    if (!ipcRenderer || !authCode) return;
    await ipcRenderer.invoke('gmail:set-token', authCode);
    setAuthCode('');
    setShowSettings(false);
    fetchGmailEmails();
  };

  return (
    <div className="glass-effect m-4 mb-0 rounded-2xl flex items-center px-6 shadow-lg z-10 text-gray-800 dark:text-gray-100">
      <div className="text-2xl font-bold mr-8 py-4 border-r border-white/20 pr-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        Email
      </div>
      <nav className="flex h-full flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-2 mx-2 transition-all relative group rounded-xl ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 shadow-xl ring-2 ring-blue-500 scale-110 z-20 translate-y-1'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/10'
              }`}
            >
              <Icon size={18} className={`mr-2 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={fetchGmailEmails}
          disabled={isLoading}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`}
          title="Refresh Gmail"
        >
          <RefreshCw size={20} />
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
          title="Settings"
        >
          <Settings size={20} />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-full right-4 mt-3 p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl z-30 w-80 text-gray-800 dark:text-gray-100"
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
                        className="w-full bg-white/50 dark:bg-black/20 border border-white/30 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1 opacity-60 uppercase">Client Secret</label>
                    <input
                        type="password"
                        placeholder="Google Client Secret"
                        value={credentials.clientSecret}
                        onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
                        className="w-full bg-white/50 dark:bg-black/20 border border-white/30 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                </div>

                <div className="pt-2">
                    <p className="text-xs mb-3 text-gray-500 dark:text-gray-400">
                        1. Provide credentials above. 2. Click button to authorize. 3. Copy code back here.
                    </p>
                    <button
                        onClick={handleConnectGmail}
                        className="w-full py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors mb-3 shadow-lg shadow-blue-500/30 text-sm"
                    >
                        Get Authorization Code
                    </button>
                    <input
                        type="text"
                        placeholder="Paste code here..."
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value)}
                        className="w-full bg-white/50 dark:bg-black/20 border border-white/30 rounded-xl p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                    <button
                        onClick={handleSetToken}
                        disabled={!authCode}
                        className="w-full py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-lg shadow-purple-500/30 text-sm"
                    >
                        Complete Setup
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
