import React from 'react';
import { Mail, Star, CheckCircle, Clock, Archive, Inbox } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'important', label: 'Important', icon: Star },
    { id: 'non-important', label: 'Non-important', icon: Mail },
    { id: 'done', label: 'Done', icon: CheckCircle },
    { id: 'later', label: 'Do Later', icon: Clock },
    { id: 'all', label: 'All Mail', icon: Archive },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-800">
        Email
      </div>
      <nav className="flex-1 mt-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
                activeTab === tab.id ? 'bg-gray-800 border-l-4 border-blue-500' : ''
              }`}
            >
              <Icon size={20} className="mr-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
