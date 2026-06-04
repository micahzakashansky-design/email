import React, { useState } from 'react';
import { CheckCircle, Clock, Star, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const EmailDetail = ({ email, onToggleImportance, onMarkDone, onMarkLater }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState('');

  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select an email to read
      </div>
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
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div className="flex space-x-4">
          <button
            onClick={() => onMarkDone(email.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <CheckCircle size={20} />
            <span>Done</span>
          </button>

          <div className="relative">
            <button
              onClick={handleMarkLater}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Clock size={20} />
              <span>{showDatePicker ? 'Set Due Date' : 'Do Later'}</span>
            </button>

            {showDatePicker && (
              <div className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 shadow-xl rounded-lg z-10 w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When do you want to do this?
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-2">
                   <button
                    onClick={() => setShowDatePicker(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onToggleImportance(email.id)}
          className={`${email.isImportant ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600 p-2`}
        >
          <Star size={24} fill={email.isImportant ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{email.subject}</h1>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                <span className="font-semibold text-gray-900">{email.from}</span>
              </div>
              <div>{format(new Date(email.date), 'MMMM d, yyyy h:mm a')}</div>
            </div>
            {email.dueDate && (
              <div className="mt-4 flex items-center text-orange-600 text-sm font-medium">
                <Calendar size={16} className="mr-2" />
                Due: {format(new Date(email.dueDate), 'MMMM d, yyyy')}
              </div>
            )}
          </div>
          <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed">
            {email.body.split('\n').map((para, i) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
