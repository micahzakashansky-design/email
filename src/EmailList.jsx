import React from 'react';
import { Star, CheckCircle, Clock, Undo, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const EmailList = ({ emails, onSelect, selectedId, onToggleImportance, onMarkDone, onMarkLater, onMoveToInbox }) => {
  return (
    <div className="w-1/3 flex flex-col glass-effect m-4 mr-2 rounded-2xl overflow-hidden shadow-lg">
      <div className="p-4 border-b border-white/20 font-bold text-gray-800 dark:text-gray-100 flex items-center justify-between">
        <span>Messages</span>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{emails.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {emails.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8 text-center"
            >
              <Mail size={48} className="mb-4 opacity-20" />
              <p>Nothing here but digital dust...</p>
            </motion.div>
          ) : (
            emails.map((email) => (
              <motion.div
                key={email.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onSelect(email)}
                className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-all group relative ${
                  selectedId === email.id ? 'bg-blue-500/10 dark:bg-blue-400/10 ring-1 ring-blue-500/30' : ''
                }`}
              >
                {selectedId === email.id && (
                  <motion.div
                    layoutId="selection-border"
                    className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-r-full"
                  />
                )}
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">{email.from}</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap pt-1">
                    {format(new Date(email.date), 'MMM d')}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 truncate">
                  {email.subject}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-3">
                  {email.body}
                </div>
                <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleImportance(email.id)}
                    className={`${email.isImportant ? 'text-yellow-500 opacity-100' : 'text-gray-400 hover:text-yellow-500 opacity-0 group-hover:opacity-100'} transition-all duration-200`}
                    title={email.isImportant ? "Mark as non-important" : "Mark as important"}
                  >
                    <Star size={14} fill={email.isImportant ? 'currentColor' : 'none'} />
                  </button>
                  <div className="flex items-center space-x-3">
                    {email.status === 'inbox' && (
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onMarkDone(email.id)}
                          className="text-gray-400 hover:text-green-500 transition-colors"
                          title="Done"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          onClick={() => onMarkLater(email.id)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          title="Do Later"
                        >
                          <Clock size={14} />
                        </button>
                      </div>
                    )}
                    {(email.status === 'later' || email.status === 'done') && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-3">
                        {email.status === 'later' && (
                          <button
                            onClick={() => onMarkDone(email.id)}
                            className="text-gray-400 hover:text-green-500 transition-colors"
                            title="Done"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => onMoveToInbox(email.id)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          title="Move to Inbox"
                        >
                          <Undo size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmailList;
