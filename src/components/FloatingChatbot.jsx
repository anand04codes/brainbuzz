import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const FloatingChatbot = () => {
  const location = useLocation();
  const isRoomPage = location.pathname.startsWith('/room');

  const [open, setOpen] = useState(false);

  if (isRoomPage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full p-4 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Toggle Chatbot"
      >
        {open ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6 animate-pulse" />
        )}
      </button>

      {/* Chatbot Iframe */}
      {open && (
        <div className="mt-4 w-[360px] h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-300 overflow-hidden animate-fadeInUp">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/Fc8HtVbZjAwpnJ4l-EQxI"
            title="Quiz Assistant"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
