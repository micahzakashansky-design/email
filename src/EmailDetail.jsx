import React, { useState } from 'react';
import { CheckCircle, Clock, Star, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const EmailDetail = ({ email, onToggleImportance, onMarkDone, onMarkLater }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState('');

  if (!email) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 glass-effect m-4 ml-2 rounded-2xl shadow-lg"
      >
        <div className="text-center">
            <Mail size={64} className="mx-auto mb-4 opacity-10" />
            <p>Select an email to dive in</p>
        </div>
      </motion.div>
    );
  }

  const handleMarkLater = () => {
    if (showDatePicker && dueDate) {
      onMarkLater(email.id, dueDate);
      setShowDatePicker(false);
      setDueDate('');
    } else {
      setShowDatePicker(true);
    }
  };

  return (
    <motion.div
      key={email.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex-1 flex flex-col glass-effect m-4 ml-2 rounded-2xl overflow-hidden shadow-lg text-gray-800 dark:text-gray-100"
    >
      <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/5">
        <div className="flex space-x-3">
          <button
            onClick={() => onMarkDone(email.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500/80 backdrop-blur-md text-white rounded-xl hover:bg-green-600 transition-all hover:shadow-lg active:scale-95"
          >
            <CheckCircle size={18} />
            <span className="font-medium text-sm">Done</span>
          </button>

          <div className="relative">
            <button
              onClick={handleMarkLater}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/80 backdrop-blur-md text-white rounded-xl hover:bg-blue-600 transition-all hover:shadow-lg active:scale-95"
            >
              <Clock size={18} />
              <span className="font-medium text-sm">{showDatePicker ? 'Set Due Date' : 'Do Later'}</span>
            </button>

            <AnimatePresence>
              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute top-full left-0 mt-3 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl z-20 w-64"
                >
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Schedule for later
                    </label>
                    <button onClick={() => setShowDatePicker(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-white/50 dark:bg-black/20 border border-white/30 rounded-xl p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <button
                    onClick={handleMarkLater}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Confirm
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={() => onToggleImportance(email.id)}
          className={`${email.isImportant ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600 p-2 transition-all hover:scale-110`}
        >
          <Star size={24} fill={email.isImportant ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                {email.subject}
            </h1>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3 shadow-md">
                    {email.from.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">{email.from}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">To: You</div>
                </div>
              </div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">
                {format(new Date(email.date), 'MMMM d, yyyy · h:mm a')}
              </div>
            </div>
            {email.dueDate && (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="mt-6 flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-600 dark:text-orange-400 text-sm font-semibold inline-flex"
              >
                <Calendar size={16} className="mr-2" />
                Reminder set for {format(new Date(email.dueDate), 'MMMM d, yyyy')}
              </motion.div>
            )}
          </div>
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg whitespace-pre-wrap">
            {email.body}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Re-importing Mail for empty state
import { Mail } from 'lucide-react';

export default EmailDetail;
