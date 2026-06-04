import React from 'react';
import { Star, CheckCircle, Clock, Archive, Mail, Sun, Moon } from 'lucide-react';
import { useEmails } from './EmailContext';
import { motion } from 'framer-motion';

const Header = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useEmails();

  const tabs = [
    { id: 'important', label: 'Important', icon: Star },
    { id: 'non-important', label: 'Non-important', icon: Mail },
    { id: 'done', label: 'Done', icon: CheckCircle },
    { id: 'later', label: 'Do Later', icon: Clock },
    { id: 'all', label: 'All Mail', icon: Archive },
  ];

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
              className={`flex items-center px-6 py-4 hover:bg-white/10 transition-all relative h-full group ${
                activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon size={18} className={`mr-2 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <button
        onClick={toggleTheme}
        className="ml-4 p-2 rounded-full hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </div>
  );
};

export default Header;
