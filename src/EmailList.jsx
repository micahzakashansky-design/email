import React from 'react';
import { Star, CheckCircle, Clock, Undo, Mail } from 'lucide-react';
import { format } from 'date-fns';

const EmailList = ({ emails, onSelect, selectedId, onToggleImportance, onMarkDone, onMarkLater, onMoveToInbox }) => {
  return (
    <div className="flex-1 overflow-y-auto border-r border-gray-200">
      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Mail size={48} className="mb-4 opacity-20" />
          <p>No emails found</p>
        </div>
      ) : (
        emails.map((email) => (
          <div
            key={email.id}
            onClick={() => onSelect(email)}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedId === email.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-gray-900">{email.from}</span>
              <span className="text-xs text-gray-500">
                {format(new Date(email.date), 'MMM d, h:mm a')}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-800 mb-1 truncate">
              {email.subject}
            </div>
            <div className="text-sm text-gray-500 truncate mb-2">
              {email.body}
            </div>
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onToggleImportance(email.id)}
                className={`${email.isImportant ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-600`}
                title={email.isImportant ? "Mark as non-important" : "Mark as important"}
              >
                <Star size={16} fill={email.isImportant ? 'currentColor' : 'none'} />
              </button>
              {email.status === 'inbox' && (
                <>
                  <button
                    onClick={() => onMarkDone(email.id)}
                    className="text-gray-300 hover:text-green-600"
                    title="Done"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => onMarkLater(email.id)}
                    className="text-gray-300 hover:text-blue-600"
                    title="Do Later"
                  >
                    <Clock size={16} />
                  </button>
                </>
              )}
               {email.status === 'later' && (
                <>
                  <button
                    onClick={() => onMarkDone(email.id)}
                    className="text-gray-300 hover:text-green-600"
                    title="Done"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => onMoveToInbox(email.id)}
                    className="text-gray-300 hover:text-blue-600"
                    title="Move to Inbox"
                  >
                    <Undo size={16} />
                  </button>
                </>
              )}
               {email.status === 'done' && (
                  <button
                    onClick={() => onMoveToInbox(email.id)}
                    className="text-gray-300 hover:text-blue-600"
                    title="Move to Inbox"
                  >
                    <Undo size={16} />
                  </button>
               )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EmailList;
